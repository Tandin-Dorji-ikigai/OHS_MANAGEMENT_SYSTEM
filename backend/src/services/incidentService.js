const { Op } = require('sequelize');
const { Incident, IncidentEscalation, IncidentInvestigation, Site, User, Role } = require('../models');
const AppError = require('../utils/AppError');
const { getPagination, getPagingData } = require('../utils/pagination');
const { buildSiteScopeWhere } = require('../utils/scope');
const { ensureTransitionAllowed } = require('../utils/workflow');
const { logAudit, logApproval, getRecordHistory } = require('./auditService');
const { notifyMany } = require('./notificationService');
const { ROLES } = require('../constants/roles');
const { createIncidentCorrectiveActions } = require('./correctiveActionAutomationService');

const incidentInclude = [
  { model: Site, as: 'site' },
  { model: User, as: 'assignedInvestigator' },
  { model: User, as: 'managementReviewer' },
  { model: IncidentInvestigation, as: 'investigations', include: [{ model: User, as: 'investigator' }] },
  { model: IncidentEscalation, as: 'escalations', include: [{ model: User, as: 'triggeredByUser' }] }
];

const normalizePriority = (value) => {
  if (!value) return null;
  return String(value).trim().toLowerCase();
};

const createEscalationRecord = async (incident, payload, user) => {
  const escalation = await IncidentEscalation.create({
    incidentId: incident.id,
    escalationType: payload.escalationType,
    escalationLevel: payload.escalationLevel,
    reason: payload.reason,
    triggeredBy: user?.id || null,
    triggeredAt: payload.triggeredAt || new Date(),
    metadata: payload.metadata || {}
  });

  await logAudit({
    moduleName: 'incident',
    recordId: incident.id,
    action: 'escalation_created',
    comments: payload.reason,
    metadata: {
      escalationType: payload.escalationType,
      escalationLevel: payload.escalationLevel
    },
    actionBy: user?.id || incident.createdBy
  });

  return escalation;
};

const listIncidents = async (query, user) => {
  const { page, limit, offset } = getPagination(query);
  const where = { ...buildSiteScopeWhere(user) };

  if (query.status) where.status = query.status;
  if (query.severity) where.severity = query.severity;
  if (query.search) where.location = { [Op.like]: `%${query.search}%` };

  const { rows, count } = await Incident.findAndCountAll({
    where,
    include: [
      { model: Site, as: 'site' },
      { model: User, as: 'creator' },
      { model: User, as: 'assignedInvestigator' }
    ],
    limit,
    offset,
    order: [['eventDate', 'DESC']]
  });

  return {
    items: rows,
    pagination: getPagingData(count, page, limit)
  };
};

const getIncidentById = async (id, user) => {
  const incident = await Incident.findOne({
    where: { id, ...buildSiteScopeWhere(user) },
    include: incidentInclude
  });
  if (!incident) {
    throw new AppError('Incident not found', 404);
  }
  const history = await getRecordHistory('incident', id);
  return { incident, history };
};

const createIncident = async (payload, user) => {
  const {
    recommendedActions,
    assignedTo,
    dueDate,
    ...incidentPayload
  } = payload;

  const incident = await Incident.create({
    ...incidentPayload,
    urgentFlag: incidentPayload.severity === 'critical',
    investigationPriority: normalizePriority(incidentPayload.investigationPriority),
    createdBy: user.id
  });

  await logAudit({
    moduleName: 'incident',
    recordId: incident.id,
    action: 'create',
    comments: 'Incident reported',
    metadata: { severity: incident.severity },
    actionBy: user.id
  });

  if (incident.urgentFlag) {
    const recipients = await User.findAll({
      include: [{ model: Role, as: 'role', where: { name: ROLES.HQ_SAFETY_OFFICER } }]
    });
    await notifyMany(
      recipients.map((item) => item.id),
      {
        title: 'High severity incident alert',
        message: `Critical incident reported at ${incident.location}`,
        type: 'high_severity_incident',
        moduleName: 'incident',
        recordId: incident.id
      }
    );

    await createEscalationRecord(
      incident,
      {
        escalationType: 'critical_incident',
        escalationLevel: 'hq_immediate',
        reason: `Critical incident reported at ${incident.location}`,
        metadata: { severity: incident.severity }
      },
      user
    );

    await createIncidentCorrectiveActions({
      incident,
      recommendedActions,
      assignedTo,
      dueDate,
      actorId: user.id,
      reviewerIds: recipients.map((item) => item.id)
    });
  } else if (recommendedActions) {
    const recipients = await User.findAll({
      include: [{ model: Role, as: 'role', where: { name: ROLES.HQ_SAFETY_OFFICER } }]
    });

    await createIncidentCorrectiveActions({
      incident,
      recommendedActions,
      assignedTo,
      dueDate,
      actorId: user.id,
      reviewerIds: recipients.map((item) => item.id)
    });
  }

  return Incident.findByPk(incident.id, { include: incidentInclude });
};

const updateIncident = async (id, payload, user) => {
  const incident = await Incident.findOne({
    where: { id, ...buildSiteScopeWhere(user) }
  });
  if (!incident) {
    throw new AppError('Incident not found', 404);
  }
  if (incident.status !== 'draft' && incident.status !== 'returned_for_correction') {
    throw new AppError('Only draft or returned incidents can be edited', 400);
  }

  await incident.update({
    ...payload,
    investigationPriority:
      payload.investigationPriority !== undefined
        ? normalizePriority(payload.investigationPriority)
        : incident.investigationPriority,
    urgentFlag: payload.severity ? payload.severity === 'critical' : incident.urgentFlag,
    updatedBy: user.id
  });

  await logAudit({
    moduleName: 'incident',
    recordId: id,
    action: 'update',
    comments: 'Incident updated',
    actionBy: user.id
  });

  return Incident.findByPk(id, { include: incidentInclude });
};

const assignInvestigator = async (incidentId, payload, user) => {
  const incident = await Incident.findOne({
    where: { id: incidentId, ...buildSiteScopeWhere(user) }
  });

  if (!incident) {
    throw new AppError('Incident not found', 404);
  }

  if (![ROLES.FIELD_SAFETY_OFFICER, ROLES.HQ_SAFETY_OFFICER].includes(user.roleName)) {
    throw new AppError('Only safety officers can assign investigators', 403);
  }

  const investigator = await User.findByPk(payload.investigatorId, {
    include: [{ model: Role, as: 'role' }]
  });

  if (!investigator) {
    throw new AppError('Investigator not found', 404);
  }

  await incident.update({
    assignedInvestigatorId: payload.investigatorId,
    investigationPriority: normalizePriority(payload.investigationPriority) || incident.investigationPriority,
    investigationDueDate: payload.investigationDueDate || incident.investigationDueDate,
    updatedBy: user.id
  });

  await logAudit({
    moduleName: 'incident',
    recordId: incidentId,
    action: 'investigator_assigned',
    comments: payload.comments || 'Investigator assigned',
    metadata: {
      investigatorId: payload.investigatorId,
      investigationPriority: normalizePriority(payload.investigationPriority),
      investigationDueDate: payload.investigationDueDate || null
    },
    actionBy: user.id
  });

  await createNotificationForInvestigator(investigator.id, incident);

  return Incident.findByPk(incidentId, { include: incidentInclude });
};

const addInvestigation = async (incidentId, payload, user) => {
  const incident = await Incident.findOne({
    where: { id: incidentId, ...buildSiteScopeWhere(user) }
  });
  if (!incident) {
    throw new AppError('Incident not found', 404);
  }
  if (user.roleName !== ROLES.FIELD_SAFETY_OFFICER && user.roleName !== ROLES.HQ_SAFETY_OFFICER) {
    throw new AppError('Only safety officers can add investigations', 403);
  }

  const investigation = await IncidentInvestigation.create({
    ...payload,
    incidentId,
    investigatorId: user.id
  });

  await logAudit({
    moduleName: 'incident',
    recordId: incidentId,
    action: 'investigation_added',
    comments: 'Investigation entry added',
    actionBy: user.id
  });

  return investigation;
};

const saveManagementReview = async (incidentId, payload, user) => {
  const incident = await Incident.findOne({
    where: { id: incidentId, ...buildSiteScopeWhere(user) }
  });

  if (!incident) {
    throw new AppError('Incident not found', 404);
  }

  if (user.roleName !== ROLES.HQ_SAFETY_OFFICER) {
    throw new AppError('Only HQ Safety Officers can save management reviews', 403);
  }

  await incident.update({
    managementReviewComments: payload.managementReviewComments,
    managementReviewedAt: new Date(),
    managementReviewedBy: user.id,
    updatedBy: user.id
  });

  await logAudit({
    moduleName: 'incident',
    recordId: incidentId,
    action: 'management_review_saved',
    comments: payload.managementReviewComments,
    actionBy: user.id
  });

  if (payload.escalate) {
    await createEscalationRecord(
      incident,
      {
        escalationType: 'management_review',
        escalationLevel: 'hq_review',
        reason: payload.escalationReason || payload.managementReviewComments,
        metadata: {
          source: 'management_review'
        }
      },
      user
    );
  }

  return Incident.findByPk(incidentId, { include: incidentInclude });
};

const createEscalation = async (incidentId, payload, user) => {
  const incident = await Incident.findOne({
    where: { id: incidentId, ...buildSiteScopeWhere(user) }
  });

  if (!incident) {
    throw new AppError('Incident not found', 404);
  }

  if (![ROLES.FIELD_SAFETY_OFFICER, ROLES.HQ_SAFETY_OFFICER, ROLES.TOP_MANAGEMENT].includes(user.roleName)) {
    throw new AppError('You are not allowed to escalate incidents', 403);
  }

  await createEscalationRecord(incident, payload, user);

  return Incident.findByPk(incidentId, { include: incidentInclude });
};

const transitionIncident = async (id, { status, comments }, user) => {
  const incident = await Incident.findOne({
    where: { id, ...buildSiteScopeWhere(user) }
  });
  if (!incident) {
    throw new AppError('Incident not found', 404);
  }

  ensureTransitionAllowed(incident.status, status);

  if (status === 'submitted' && user.roleName !== ROLES.SAFETY_SUPERVISOR) {
    throw new AppError('Only Safety Supervisors can submit incidents', 403);
  }
  if (status === 'validated' && user.roleName !== ROLES.FIELD_SAFETY_OFFICER) {
    throw new AppError('Only Field Safety Officers can validate incidents', 403);
  }
  if (['approved', 'rejected', 'closed'].includes(status) && user.roleName !== ROLES.HQ_SAFETY_OFFICER) {
    throw new AppError('Only HQ Safety Officers can perform this action', 403);
  }

  const fromStatus = incident.status;
  await incident.update({
    status,
    updatedBy: user.id,
    submittedAt: status === 'submitted' ? new Date() : incident.submittedAt,
    validatedAt: status === 'validated' ? new Date() : incident.validatedAt,
    approvedAt: status === 'approved' ? new Date() : incident.approvedAt,
    approvedBy: status === 'approved' ? user.id : incident.approvedBy
  });

  if (status === 'closed') {
    await IncidentEscalation.update(
      {
        resolvedAt: new Date()
      },
      {
        where: {
          incidentId: id,
          resolvedAt: null
        }
      }
    );
  }

  const actionMap = {
    submitted: 'submit',
    under_review: 'review',
    returned_for_correction: 'return',
    validated: 'validate',
    approved: 'approve',
    rejected: 'reject',
    closed: 'close',
    draft: 'review'
  };

  await logApproval({
    moduleName: 'incident',
    recordId: id,
    action: actionMap[status],
    fromStatus,
    toStatus: status,
    comments,
    actionBy: user.id
  });

  await logAudit({
    moduleName: 'incident',
    recordId: id,
    action: `status_${status}`,
    comments,
    metadata: { fromStatus, toStatus: status },
    actionBy: user.id
  });

  return Incident.findByPk(id, { include: incidentInclude });
};

async function createNotificationForInvestigator(investigatorId, incident) {
  await notifyMany(
    [investigatorId],
    {
      title: 'Incident investigation assigned',
      message: `You were assigned to investigate incident at ${incident.location}`,
      type: 'submission_created',
      moduleName: 'incident',
      recordId: incident.id
    }
  );
}

module.exports = {
  listIncidents,
  getIncidentById,
  createIncident,
  updateIncident,
  assignInvestigator,
  addInvestigation,
  saveManagementReview,
  createEscalation,
  transitionIncident
};
