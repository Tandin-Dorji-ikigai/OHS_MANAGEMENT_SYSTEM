const { Op } = require('sequelize');
const { Inspection, InspectionItem, InspectionFinding, Site, User, Role } = require('../models');
const AppError = require('../utils/AppError');
const { getPagination, getPagingData } = require('../utils/pagination');
const { buildSiteScopeWhere } = require('../utils/scope');
const { ensureTransitionAllowed } = require('../utils/workflow');
const { logAudit, logApproval, getRecordHistory } = require('./auditService');
const { notifyMany } = require('./notificationService');
const { ROLES } = require('../constants/roles');
const { createInspectionCorrectiveActions } = require('./correctiveActionAutomationService');

const inspectionInclude = [
  { model: Site, as: 'site' },
  { model: InspectionItem, as: 'items' },
  { model: InspectionFinding, as: 'findings' }
];

const calculateCompliance = (items = []) => {
  if (!items.length) {
    return 0;
  }
  const compliant = items.filter((item) => item.isCompliant).length;
  return Number(((compliant / items.length) * 100).toFixed(2));
};

const ensureScopedSite = (user, siteId) => {
  const scoped = buildSiteScopeWhere(user);
  if (!scoped.siteId) {
    return;
  }
  if (!user.siteIds.includes(siteId)) {
    throw new AppError('Record is outside your site scope', 403);
  }
};

const listInspections = async (query, user) => {
  const { page, limit, offset } = getPagination(query);
  const where = {
    ...buildSiteScopeWhere(user)
  };

  if (query.status) {
    where.status = query.status;
  }
  if (query.search) {
    where.title = { [Op.like]: `%${query.search}%` };
  }

  const { rows, count } = await Inspection.findAndCountAll({
    where,
    include: [{ model: Site, as: 'site' }, { model: User, as: 'creator' }],
    limit,
    offset,
    order: [['createdAt', 'DESC']]
  });

  return {
    items: rows,
    pagination: getPagingData(count, page, limit)
  };
};

const getInspectionById = async (id, user) => {
  const inspection = await Inspection.findOne({
    where: { id, ...buildSiteScopeWhere(user) },
    include: inspectionInclude
  });

  if (!inspection) {
    throw new AppError('Inspection not found', 404);
  }

  const history = await getRecordHistory('inspection', id);
  return { inspection, history };
};

const createInspection = async (payload, user) => {
  ensureScopedSite(user, payload.siteId);
  const inspection = await Inspection.create({
    title: payload.title,
    siteId: payload.siteId,
    scheduleDate: payload.scheduleDate,
    inspectionDate: payload.inspectionDate,
    templateName: payload.templateName,
    observations: payload.observations,
    recommendations: payload.recommendations,
    complianceScore: calculateCompliance(payload.items),
    createdBy: user.id
  });

  await InspectionItem.bulkCreate(payload.items.map((item) => ({ ...item, inspectionId: inspection.id })));
  await InspectionFinding.bulkCreate(payload.findings.map((finding) => ({ ...finding, inspectionId: inspection.id })));

  const reviewerIds = await getReviewersForInspection(inspection.siteId, ROLES.HQ_SAFETY_OFFICER);
  await createInspectionCorrectiveActions({
    inspection,
    findings: payload.findings,
    actorId: user.id,
    reviewerIds
  });

  await logAudit({
    moduleName: 'inspection',
    recordId: inspection.id,
    action: 'create',
    comments: 'Inspection created',
    metadata: { status: 'draft' },
    actionBy: user.id
  });

  return Inspection.findByPk(inspection.id, { include: inspectionInclude });
};

const updateInspection = async (id, payload, user) => {
  const inspection = await Inspection.findOne({
    where: { id, ...buildSiteScopeWhere(user) }
  });
  if (!inspection) {
    throw new AppError('Inspection not found', 404);
  }
  if (inspection.status !== 'draft' && inspection.status !== 'returned_for_correction') {
    throw new AppError('Only draft or returned inspections can be edited', 400);
  }

  if (payload.siteId) {
    ensureScopedSite(user, payload.siteId);
  }

  const updatePayload = {
    ...payload,
    updatedBy: user.id
  };
  delete updatePayload.items;
  delete updatePayload.findings;

  if (payload.items) {
    updatePayload.complianceScore = calculateCompliance(payload.items);
  }

  await inspection.update(updatePayload);

  if (payload.items) {
    await InspectionItem.destroy({ where: { inspectionId: id }, force: true });
    await InspectionItem.bulkCreate(payload.items.map((item) => ({ ...item, inspectionId: id })));
  }
  if (payload.findings) {
    await InspectionFinding.destroy({ where: { inspectionId: id }, force: true });
    await InspectionFinding.bulkCreate(payload.findings.map((finding) => ({ ...finding, inspectionId: id })));
  }

  await logAudit({
    moduleName: 'inspection',
    recordId: id,
    action: 'update',
    comments: 'Inspection updated',
    actionBy: user.id
  });

  return Inspection.findByPk(id, { include: inspectionInclude });
};

const getReviewersForInspection = async (siteId, targetRole) => {
  const users = await User.findAll({
    include: [
      { model: Role, as: 'role', where: { name: targetRole } },
      { model: Site, as: 'sites', where: { id: siteId }, through: { attributes: [] } }
    ]
  });
  return users.map((item) => item.id);
};

const transitionInspection = async (id, { status, comments }, user) => {
  const inspection = await Inspection.findOne({
    where: { id, ...buildSiteScopeWhere(user) },
    include: [{ model: Site, as: 'site' }]
  });
  if (!inspection) {
    throw new AppError('Inspection not found', 404);
  }

  const fromStatus = inspection.status;
  ensureTransitionAllowed(fromStatus, status);

  if (status === 'submitted' && user.roleName !== ROLES.SAFETY_SUPERVISOR) {
    throw new AppError('Only Safety Supervisors can submit inspections', 403);
  }
  if (status === 'validated' && user.roleName !== ROLES.FIELD_SAFETY_OFFICER) {
    throw new AppError('Only Field Safety Officers can validate inspections', 403);
  }
  if (['approved', 'rejected', 'closed'].includes(status) && user.roleName !== ROLES.HQ_SAFETY_OFFICER) {
    throw new AppError('Only HQ Safety Officers can perform this action', 403);
  }

  const updatePayload = {
    status,
    updatedBy: user.id
  };
  if (status === 'submitted') updatePayload.submittedAt = new Date();
  if (status === 'validated') updatePayload.validatedAt = new Date();
  if (status === 'approved') {
    updatePayload.approvedAt = new Date();
    updatePayload.approvedBy = user.id;
  }

  await inspection.update(updatePayload);

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
    moduleName: 'inspection',
    recordId: id,
    action: actionMap[status],
    fromStatus,
    toStatus: status,
    comments,
    actionBy: user.id
  });

  await logAudit({
    moduleName: 'inspection',
    recordId: id,
    action: `status_${status}`,
    comments,
    metadata: { fromStatus, toStatus: status },
    actionBy: user.id
  });

  if (status === 'submitted') {
    const reviewerIds = await getReviewersForInspection(inspection.siteId, ROLES.FIELD_SAFETY_OFFICER);
    await notifyMany(reviewerIds, {
      title: 'Inspection submitted',
      message: `${inspection.title} is waiting for review`,
      type: 'submission_created',
      moduleName: 'inspection',
      recordId: inspection.id
    });
  }

  return Inspection.findByPk(id, { include: inspectionInclude });
};

module.exports = {
  listInspections,
  getInspectionById,
  createInspection,
  updateInspection,
  transitionInspection
};
