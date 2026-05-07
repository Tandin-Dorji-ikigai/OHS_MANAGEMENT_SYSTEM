const {
  RiskAssessment,
  RiskItem,
  Training,
  ToolboxMeeting,
  OhsActivity,
  OhsPlan,
  CorrectiveAction,
  Site,
  User
} = require('../models');
const { buildModuleService } = require('./phaseModuleService');

const calculateRiskFields = (item) => {
  const riskScore = item.likelihood * item.severity;
  let riskLevel = 'low';
  if (riskScore >= 16) riskLevel = 'critical';
  else if (riskScore >= 10) riskLevel = 'high';
  else if (riskScore >= 5) riskLevel = 'medium';

  return {
    ...item,
    riskScore,
    riskLevel
  };
};

const siteInclude = [{ model: Site, as: 'site' }];
const detailSiteCreatorInclude = [{ model: Site, as: 'site' }, { model: User, as: 'creator' }];

const riskAssessmentService = buildModuleService({
  model: RiskAssessment,
  moduleName: 'risk_assessment',
  searchFields: ['title', 'jobTask'],
  listInclude: siteInclude,
  detailInclude: [...detailSiteCreatorInclude, { model: RiskItem, as: 'items' }],
  prepareCreatePayload: ({ items, ...payload }) => payload,
  prepareUpdatePayload: ({ items, ...payload }) => payload,
  syncChildren: async (riskAssessmentId, payload) => {
    if (!payload.items) {
      return;
    }
    await RiskItem.destroy({ where: { riskAssessmentId }, force: true });
    await RiskItem.bulkCreate(payload.items.map((item) => ({ ...calculateRiskFields(item), riskAssessmentId })));
  },
  destroyChildren: async (riskAssessmentId) => {
    await RiskItem.destroy({ where: { riskAssessmentId }, force: true });
  }
});

const trainingService = buildModuleService({
  model: Training,
  moduleName: 'training',
  searchFields: ['title', 'topic', 'trainerName'],
  listInclude: siteInclude,
  detailInclude: detailSiteCreatorInclude,
  prepareCreatePayload: (payload) => ({
    ...payload,
    attendeeCount: payload.attendees?.length || 0
  }),
  prepareUpdatePayload: (payload) => ({
    ...payload,
    attendeeCount: payload.attendees ? payload.attendees.length : undefined
  })
});

const toolboxMeetingService = buildModuleService({
  model: ToolboxMeeting,
  moduleName: 'toolbox_meeting',
  searchFields: ['topic', 'facilitator'],
  listInclude: siteInclude,
  detailInclude: detailSiteCreatorInclude
});

const activityService = buildModuleService({
  model: OhsActivity,
  moduleName: 'ohs_activity',
  searchFields: ['title', 'activityType'],
  listInclude: siteInclude,
  detailInclude: detailSiteCreatorInclude
});

const planService = buildModuleService({
  model: OhsPlan,
  moduleName: 'ohs_plan',
  searchFields: ['title', 'ownerName', 'targetMetric'],
  listInclude: siteInclude,
  detailInclude: detailSiteCreatorInclude
});

const correctiveActionService = buildModuleService({
  model: CorrectiveAction,
  moduleName: 'corrective_action',
  searchFields: ['title', 'sourceModule'],
  listInclude: [{ model: Site, as: 'site' }, { model: User, as: 'assignee' }],
  detailInclude: [{ model: Site, as: 'site' }, { model: User, as: 'creator' }, { model: User, as: 'assignee' }],
  editableStatuses: ['open', 'in_progress', 'overdue'],
  isAction: true
});

module.exports = {
  riskAssessmentService,
  trainingService,
  toolboxMeetingService,
  activityService,
  planService,
  correctiveActionService
};
