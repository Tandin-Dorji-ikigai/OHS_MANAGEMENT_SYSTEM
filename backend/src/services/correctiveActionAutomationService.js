const dayjs = require('dayjs');
const { CorrectiveAction } = require('../models');
const { createNotification, notifyMany } = require('./notificationService');
const { logAudit } = require('./auditService');

const dueDaysByPriority = {
  critical: 3,
  high: 7,
  medium: 14,
  low: 30
};

const severityToPriority = {
  critical: 'critical',
  major: 'high',
  moderate: 'medium',
  minor: 'low'
};

const computeDueDate = (priority) =>
  dayjs()
    .add(dueDaysByPriority[priority] || dueDaysByPriority.medium, 'day')
    .format('YYYY-MM-DD');

const createCorrectiveActionRecord = async (payload, actorId) => {
  const record = await CorrectiveAction.create({
    ...payload,
    createdBy: actorId
  });

  await logAudit({
    moduleName: 'corrective_action',
    recordId: record.id,
    action: 'create',
    comments: 'Corrective action auto-created',
    metadata: {
      sourceModule: payload.sourceModule,
      sourceRecordId: payload.sourceRecordId
    },
    actionBy: actorId
  });

  if (payload.assignedTo) {
    await createNotification({
      userId: payload.assignedTo,
      title: 'Corrective action assigned',
      message: `${payload.title} has been assigned to you`,
      type: 'submission_created',
      moduleName: 'corrective_action',
      recordId: record.id
    });
  }

  return record;
};

const createInspectionCorrectiveActions = async ({ inspection, findings = [], actorId, reviewerIds = [] }) => {
  const actionableFindings = findings.filter((finding) => finding.actionRequired);

  const created = [];
  for (const finding of actionableFindings) {
    const record = await createCorrectiveActionRecord(
      {
        title: finding.title,
        description: finding.recommendation || finding.description,
        sourceModule: 'inspection',
        sourceRecordId: inspection.id,
        siteId: inspection.siteId,
        assignedTo: null,
        priority: finding.priority || 'medium',
        dueDate: computeDueDate(finding.priority || 'medium'),
        status: 'open'
      },
      actorId
    );
    created.push(record);
  }

  if (created.length && reviewerIds.length) {
    await notifyMany(reviewerIds, {
      title: 'Corrective actions generated',
      message: `${created.length} corrective action(s) were generated from inspection ${inspection.title}.`,
      type: 'submission_created',
      moduleName: 'inspection',
      recordId: inspection.id
    });
  }

  return created;
};

const createIncidentCorrectiveActions = async ({
  incident,
  recommendedActions,
  assignedTo,
  dueDate,
  actorId,
  reviewerIds = []
}) => {
  if (!recommendedActions) {
    return [];
  }

  const priority = severityToPriority[incident.severity] || 'medium';
  const record = await createCorrectiveActionRecord(
    {
      title: `Follow-up action for ${incident.location}`,
      description: recommendedActions,
      sourceModule: 'incident',
      sourceRecordId: incident.id,
      siteId: incident.siteId,
      assignedTo: assignedTo || null,
      priority,
      dueDate: dueDate || computeDueDate(priority),
      status: 'open'
    },
    actorId
  );

  if (reviewerIds.length) {
    await notifyMany(reviewerIds, {
      title: 'Incident corrective action generated',
      message: `A corrective action was generated for incident at ${incident.location}.`,
      type: 'submission_created',
      moduleName: 'incident',
      recordId: incident.id
    });
  }

  return [record];
};

module.exports = {
  createInspectionCorrectiveActions,
  createIncidentCorrectiveActions,
  computeDueDate
};
