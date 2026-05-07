const { Op, fn, col, literal } = require('sequelize');
const dayjs = require('dayjs');
const {
  Inspection,
  Incident,
  CorrectiveAction,
  Training,
  Site,
  User,
  OhsActivity
} = require('../models');
const { buildSiteScopeWhere } = require('../utils/scope');
const { ROLES } = require('../constants/roles');

const formatDate = (value) => (value ? dayjs(value).format('YYYY-MM-DD') : null);

const formatStatus = (value = '') =>
  String(value)
    .split('_')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');

const formatModuleLabel = (value = '') =>
  String(value)
    .split('_')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');

const severityRank = {
  critical: 4,
  major: 3,
  moderate: 2,
  minor: 1
};

const priorityRank = {
  critical: 4,
  high: 3,
  medium: 2,
  low: 1
};

const getDashboardScope = (user) => {
  if (user.roleName === ROLES.TOP_MANAGEMENT) {
    return { role: user.roleName, siteScope: {} };
  }

  if (user.roleName === ROLES.HQ_SAFETY_OFFICER) {
    return { role: user.roleName, siteScope: {} };
  }

  return {
    role: user.roleName,
    siteScope: buildSiteScopeWhere(user)
  };
};

const getScopeSites = async (siteScope, limit = 6) => {
  return Site.findAll({
    where: {
      ...buildSiteScopeWhere(
        {
          roleName: ROLES.FIELD_SAFETY_OFFICER,
          siteIds: siteScope.siteId?.[Op.in]
        },
        'id'
      ),
      isActive: true
    },
    attributes: ['id', 'code', 'name', 'region', 'latitude', 'longitude'],
    order: [['name', 'ASC']],
    limit,
    raw: true
  });
};

const getSiteComplianceSeries = async (siteScope, fallbackSites = []) => {
  const rows = await Inspection.findAll({
    where: { ...siteScope, status: 'approved' },
    include: [{ model: Site, as: 'site', attributes: ['id', 'code', 'name'] }],
    attributes: ['siteId', [fn('AVG', col('compliance_score')), 'averageCompliance']],
    group: ['siteId', 'site.id'],
    order: [[literal('"averageCompliance"'), 'DESC']],
    limit: 6,
    raw: false
  });

  if (rows.length) {
    return rows.map((row) => ({
      siteId: row.siteId,
      label: row.site?.code || row.site?.name || 'Site',
      value: Number(Number(row.get('averageCompliance') || 0).toFixed(1))
    }));
  }

  return fallbackSites.slice(0, 6).map((site) => ({
    siteId: site.id,
    label: site.code || site.name,
    value: 0
  }));
};

const getPendingApprovalFeed = async (siteScope) => {
  const [inspectionRows, incidentRows, correctiveActionRows] = await Promise.all([
    Inspection.findAll({
      where: {
        ...siteScope,
        status: { [Op.in]: ['submitted', 'validated', 'under_review'] }
      },
      include: [
        { model: Site, as: 'site', attributes: ['name'] },
        { model: User, as: 'creator', attributes: ['firstName', 'lastName'] }
      ],
      order: [['submittedAt', 'DESC'], ['updatedAt', 'DESC']],
      limit: 4
    }),
    Incident.findAll({
      where: {
        ...siteScope,
        status: { [Op.in]: ['submitted', 'validated', 'under_review'] }
      },
      include: [
        { model: Site, as: 'site', attributes: ['name'] },
        { model: User, as: 'creator', attributes: ['firstName', 'lastName'] }
      ],
      order: [['submittedAt', 'DESC'], ['updatedAt', 'DESC']],
      limit: 4
    }),
    CorrectiveAction.findAll({
      where: {
        ...siteScope,
        status: { [Op.in]: ['pending_verification', 'overdue'] }
      },
      include: [
        { model: Site, as: 'site', attributes: ['name'] },
        { model: User, as: 'creator', attributes: ['firstName', 'lastName'] }
      ],
      order: [['updatedAt', 'DESC'], ['dueDate', 'ASC']],
      limit: 4
    })
  ]);

  return [
    ...inspectionRows.map((row) => ({
      id: row.id,
      type: 'Inspection',
      module: 'Inspection',
      submittedBy:
        [row.creator?.firstName, row.creator?.lastName].filter(Boolean).join(' ') || 'System User',
      site: row.site?.name || 'Unassigned site',
      date: formatDate(row.submittedAt || row.updatedAt || row.createdAt),
      status: formatStatus(row.status),
      sortDate: row.submittedAt || row.updatedAt || row.createdAt
    })),
    ...incidentRows.map((row) => ({
      id: row.id,
      type: formatModuleLabel(row.incidentType),
      module: 'Incident',
      submittedBy:
        [row.creator?.firstName, row.creator?.lastName].filter(Boolean).join(' ') || 'System User',
      site: row.site?.name || 'Unassigned site',
      date: formatDate(row.submittedAt || row.updatedAt || row.createdAt),
      status: formatStatus(row.status),
      sortDate: row.submittedAt || row.updatedAt || row.createdAt
    })),
    ...correctiveActionRows.map((row) => ({
      id: row.id,
      type: 'Corrective Action',
      module: 'CAPA',
      submittedBy:
        [row.creator?.firstName, row.creator?.lastName].filter(Boolean).join(' ') || 'System User',
      site: row.site?.name || 'Unassigned site',
      date: formatDate(row.updatedAt || row.createdAt || row.dueDate),
      status: formatStatus(row.status),
      sortDate: row.updatedAt || row.createdAt || row.dueDate
    }))
  ]
    .sort((a, b) => new Date(b.sortDate) - new Date(a.sortDate))
    .slice(0, 6)
    .map(({ sortDate, ...rest }) => rest);
};

const getWorkflowQueue = async (siteScope) => {
  return getPendingApprovalFeed(siteScope);
};

const getRecentIncidentFeed = async (siteScope) => {
  const rows = await Incident.findAll({
    where: {
      ...siteScope,
      status: { [Op.not]: 'draft' }
    },
    include: [{ model: Site, as: 'site', attributes: ['name'] }],
    order: [['eventDate', 'DESC'], ['createdAt', 'DESC']],
    limit: 5
  });

  return rows.map((incident) => ({
    id: incident.id,
    title: `${formatModuleLabel(incident.incidentType)} at ${incident.location}`,
    site: incident.site?.name || 'Unassigned site',
    severity: formatStatus(incident.severity),
    timestamp: formatDate(incident.eventDate || incident.createdAt),
    status: formatStatus(incident.status)
  }));
};

const getAlertFeed = async (siteScope) => {
  const [urgentIncidents, overdueCorrectiveActions, pendingApprovals] = await Promise.all([
    Incident.findAll({
      where: { ...siteScope, urgentFlag: true, status: { [Op.notIn]: ['rejected', 'closed'] } },
      include: [{ model: Site, as: 'site', attributes: ['name'] }],
      order: [['eventDate', 'DESC']],
      limit: 4
    }),
    CorrectiveAction.findAll({
      where: {
        ...siteScope,
        dueDate: { [Op.lt]: dayjs().format('YYYY-MM-DD') },
        status: { [Op.ne]: 'closed' }
      },
      include: [{ model: Site, as: 'site', attributes: ['name'] }],
      order: [['dueDate', 'ASC']],
      limit: 4
    }),
    getPendingApprovalFeed(siteScope)
  ]);

  const alertItems = [
    ...urgentIncidents.map((incident) => ({
      id: incident.id,
      title: `${formatModuleLabel(incident.incidentType)} at ${incident.location}`,
      site: incident.site?.name || 'Unassigned site',
      stamp: `Reported ${formatDate(incident.eventDate)}`,
      severity: formatStatus(incident.severity),
      score: severityRank[incident.severity] || 0
    })),
    ...overdueCorrectiveActions.map((action) => ({
      id: action.id,
      title: action.title,
      site: action.site?.name || 'Unassigned site',
      stamp: `Overdue since ${formatDate(action.dueDate)}`,
      severity: formatStatus(action.priority),
      score: priorityRank[action.priority] || 0
    }))
  ];

  if (pendingApprovals.length) {
    alertItems.push({
      id: 'pending-approvals',
      title: `${pendingApprovals.length} items are awaiting approval`,
      site: 'Approval workflow',
      stamp: 'Review queue requires attention',
      severity: 'Warning',
      score: 2
    });
  }

  return alertItems
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);
};

const getSiteStatus = async (siteScope, fallbackSites = []) => {
  const [incidentCounts, overdueCounts, scopedSites] = await Promise.all([
    Incident.findAll({
      where: { ...siteScope, status: { [Op.notIn]: ['rejected', 'closed'] } },
      attributes: ['siteId', [fn('COUNT', col('id')), 'incidentCount']],
      group: ['siteId'],
      raw: true
    }),
    CorrectiveAction.findAll({
      where: {
        ...siteScope,
        dueDate: { [Op.lt]: dayjs().format('YYYY-MM-DD') },
        status: { [Op.ne]: 'closed' }
      },
      attributes: ['siteId', [fn('COUNT', col('id')), 'overdueCount']],
      group: ['siteId'],
      raw: true
    }),
    getScopeSites(siteScope, 4)
  ]);

  const sourceSites = scopedSites.length ? scopedSites : fallbackSites.slice(0, 4);
  const incidentMap = new Map(incidentCounts.map((row) => [row.siteId, Number(row.incidentCount)]));
  const overdueMap = new Map(overdueCounts.map((row) => [row.siteId, Number(row.overdueCount)]));

  return sourceSites.map((site) => {
    const openIncidents = incidentMap.get(site.id) || 0;
    const overdueActions = overdueMap.get(site.id) || 0;
    const riskScore = openIncidents + overdueActions;

    return {
      siteId: site.id,
      label: site.code || site.name,
      region: site.region || 'Region not set',
      openIncidents,
      overdueActions,
      status: riskScore >= 3 ? 'Alert' : riskScore >= 1 ? 'Watch' : 'Safe',
      latitude: site.latitude,
      longitude: site.longitude
    };
  });
};

const getRecentActivityFeed = async (siteScope) => {
  const [inspections, incidents, correctiveActions, activities] = await Promise.all([
    Inspection.findAll({
      where: { ...siteScope, status: { [Op.not]: 'draft' } },
      include: [
        { model: Site, as: 'site', attributes: ['name'] },
        { model: User, as: 'creator', attributes: ['firstName', 'lastName'] }
      ],
      order: [['updatedAt', 'DESC']],
      limit: 3
    }),
    Incident.findAll({
      where: { ...siteScope, status: { [Op.not]: 'draft' } },
      include: [
        { model: Site, as: 'site', attributes: ['name'] },
        { model: User, as: 'creator', attributes: ['firstName', 'lastName'] }
      ],
      order: [['updatedAt', 'DESC']],
      limit: 3
    }),
    CorrectiveAction.findAll({
      where: { ...siteScope },
      include: [
        { model: Site, as: 'site', attributes: ['name'] },
        { model: User, as: 'creator', attributes: ['firstName', 'lastName'] }
      ],
      order: [['updatedAt', 'DESC']],
      limit: 3
    }),
    OhsActivity.findAll({
      where: { ...siteScope, status: { [Op.not]: 'draft' } },
      include: [
        { model: Site, as: 'site', attributes: ['name'] },
        { model: User, as: 'creator', attributes: ['firstName', 'lastName'] }
      ],
      order: [['updatedAt', 'DESC']],
      limit: 3
    })
  ]);

  return [
    ...inspections.map((row) => ({
      id: `inspection-${row.id}`,
      title: `Inspection ${formatStatus(row.status)}`,
      detail: `${row.site?.name || 'Unassigned site'} - ${
        [row.creator?.firstName, row.creator?.lastName].filter(Boolean).join(' ') || 'System User'
      }`,
      timestamp: formatDate(row.updatedAt || row.submittedAt || row.createdAt),
      type: 'Inspection',
      sortDate: row.updatedAt || row.submittedAt || row.createdAt
    })),
    ...incidents.map((row) => ({
      id: `incident-${row.id}`,
      title: `Incident ${formatStatus(row.status)}`,
      detail: `${row.site?.name || 'Unassigned site'} - ${
        [row.creator?.firstName, row.creator?.lastName].filter(Boolean).join(' ') || 'System User'
      }`,
      timestamp: formatDate(row.updatedAt || row.submittedAt || row.createdAt),
      type: 'Incident',
      sortDate: row.updatedAt || row.submittedAt || row.createdAt
    })),
    ...correctiveActions.map((row) => ({
      id: `capa-${row.id}`,
      title: `CAPA ${formatStatus(row.status)}`,
      detail: `${row.site?.name || 'Unassigned site'} - ${
        [row.creator?.firstName, row.creator?.lastName].filter(Boolean).join(' ') || 'System User'
      }`,
      timestamp: formatDate(row.updatedAt || row.createdAt),
      type: 'CAPA',
      sortDate: row.updatedAt || row.createdAt
    })),
    ...activities.map((row) => ({
      id: `activity-${row.id}`,
      title: `${formatModuleLabel(row.activityType)} ${formatStatus(row.status)}`,
      detail: `${row.site?.name || 'Unassigned site'} - ${
        [row.creator?.firstName, row.creator?.lastName].filter(Boolean).join(' ') || 'System User'
      }`,
      timestamp: formatDate(row.updatedAt || row.activityDate || row.createdAt),
      type: 'Activity',
      sortDate: row.updatedAt || row.activityDate || row.createdAt
    }))
  ]
    .sort((a, b) => new Date(b.sortDate) - new Date(a.sortDate))
    .slice(0, 6)
    .map(({ sortDate, ...rest }) => rest);
};

const buildDashboardPayload = ({
  role,
  primaryMetrics,
  summary,
  siteCompliance,
  workflow,
  alerts,
  siteStatus
}) => ({
  role,
  summary,
  metrics: primaryMetrics,
  siteCompliance,
  workflow,
  alerts,
  siteStatus
});

const getFieldMetrics = async (user, siteScope) => {
  const [myPendingSubmissions, returnedRecords, overdueActions, scopeSites] = await Promise.all([
    Inspection.count({
      where: {
        ...siteScope,
        createdBy: user.id,
        status: { [Op.in]: ['draft', 'submitted', 'under_review'] }
      }
    }),
    Inspection.count({
      where: { ...siteScope, createdBy: user.id, status: 'returned_for_correction' }
    }),
    CorrectiveAction.count({
      where: {
        ...siteScope,
        assignedTo: user.id,
        dueDate: { [Op.lt]: dayjs().format('YYYY-MM-DD') },
        status: { [Op.ne]: 'closed' }
      }
    }),
    getScopeSites(siteScope, 6)
  ]);

  const siteCompliance = await getSiteComplianceSeries(siteScope, scopeSites);
  const complianceScore = siteCompliance.length
    ? Number((siteCompliance.reduce((sum, item) => sum + item.value, 0) / siteCompliance.length).toFixed(1))
    : 0;

  return {
    summary: {
      title: 'Operational queue',
      body: `${myPendingSubmissions} submissions are in progress, ${returnedRecords} were returned for correction, and ${overdueActions} corrective actions are overdue.`
    },
    metrics: [
      {
        key: 'myPendingSubmissions',
        label: 'Pending Submissions',
        value: myPendingSubmissions,
        detail: 'Assigned to your queue',
        tone: 'warning',
        progress: null
      },
      {
        key: 'returnedRecords',
        label: 'Returned Records',
        value: returnedRecords,
        detail: 'Need revision before resubmission',
        tone: 'danger',
        progress: null
      },
      {
        key: 'overdueActions',
        label: 'Overdue Actions',
        value: overdueActions,
        detail: 'Action plan required',
        tone: 'warning',
        progress: null
      },
      {
        key: 'complianceScore',
        label: 'Compliance Score',
        value: complianceScore,
        detail: 'Average approved score',
        tone: 'success',
        progress: complianceScore
      }
    ],
    siteCompliance
  };
};

const getHqMetrics = async (siteScope) => {
  const [
    pendingInspectionApprovals,
    pendingIncidentApprovals,
    incidentAlerts,
    overdueActions,
    approvedInspectionAverage,
    scopeSites
  ] = await Promise.all([
    Inspection.count({ where: { ...siteScope, status: { [Op.in]: ['submitted', 'validated'] } } }),
    Incident.count({ where: { ...siteScope, status: { [Op.in]: ['submitted', 'validated'] } } }),
    Incident.count({ where: { ...siteScope, urgentFlag: true, status: { [Op.notIn]: ['rejected', 'closed'] } } }),
    CorrectiveAction.count({
      where: {
        ...siteScope,
        dueDate: { [Op.lt]: dayjs().format('YYYY-MM-DD') },
        status: { [Op.ne]: 'closed' }
      }
    }),
    Inspection.findOne({
      where: { ...siteScope, status: 'approved' },
      attributes: [[fn('AVG', col('compliance_score')), 'averageCompliance']],
      raw: true
    }),
    getScopeSites(siteScope, 6)
  ]);

  const averageInspectionCompliance = Number(approvedInspectionAverage?.averageCompliance || 0);
  const siteCompliance = await getSiteComplianceSeries(siteScope, scopeSites);

  return {
    summary: {
      title: 'Command center',
      body: `${pendingInspectionApprovals + pendingIncidentApprovals} approvals are awaiting review, ${incidentAlerts} incident alerts are open, and ${overdueActions} corrective actions are overdue.`
    },
    metrics: [
      {
        key: 'pendingApprovals',
        label: 'Pending Approvals',
        value: pendingInspectionApprovals + pendingIncidentApprovals,
        detail: 'Inspection and incident records',
        tone: 'warning',
        progress: null
      },
      {
        key: 'incidentAlerts',
        label: 'Incident Alerts',
        value: incidentAlerts,
        detail: 'Urgent incidents still open',
        tone: 'danger',
        progress: null
      },
      {
        key: 'overdueActions',
        label: 'Overdue Actions',
        value: overdueActions,
        detail: 'Past due corrective actions',
        tone: 'warning',
        progress: null
      },
      {
        key: 'averageInspectionCompliance',
        label: 'Compliance Score',
        value: Number(averageInspectionCompliance.toFixed(1)),
        detail: 'Average approved inspection score',
        tone: 'success',
        progress: averageInspectionCompliance
      }
    ],
    siteCompliance
  };
};

const getManagementMetrics = async () => {
  const [
    totalIncidents,
    lostTimeInjuries,
    complianceAverage,
    overdueActions,
    trainingCoverage,
    scopeSites
  ] = await Promise.all([
    Incident.count({ where: { status: 'approved' } }),
    Incident.count({
      where: {
        status: 'approved',
        incidentType: 'accident',
        severity: { [Op.in]: ['major', 'critical'] }
      }
    }),
    Inspection.findOne({
      where: { status: 'approved' },
      attributes: [[fn('AVG', col('compliance_score')), 'averageCompliance']],
      raw: true
    }),
    CorrectiveAction.count({
      where: {
        status: { [Op.ne]: 'closed' },
        dueDate: { [Op.lt]: dayjs().format('YYYY-MM-DD') }
      }
    }),
    Training.findOne({
      where: { status: 'approved' },
      attributes: [[fn('SUM', col('attendee_count')), 'attendeeTotal']],
      raw: true
    }),
    getScopeSites({}, 6)
  ]);

  const compliancePercentage = Number(complianceAverage?.averageCompliance || 0);
  const attendeeCoverage = Number(trainingCoverage?.attendeeTotal || 0);
  const siteCompliance = await getSiteComplianceSeries({}, scopeSites);

  return {
    summary: {
      title: 'Enterprise oversight',
      body: `${totalIncidents} approved incidents, ${lostTimeInjuries} high-severity injuries, and ${overdueActions} overdue actions are currently reflected across the enterprise portfolio.`
    },
    metrics: [
      {
        key: 'totalIncidents',
        label: 'Approved Incidents',
        value: totalIncidents,
        detail: 'Across all approved records',
        tone: 'danger',
        progress: null
      },
      {
        key: 'lostTimeInjuries',
        label: 'Lost Time Injuries',
        value: lostTimeInjuries,
        detail: 'Major or critical accidents',
        tone: 'danger',
        progress: null
      },
      {
        key: 'trainingCoverage',
        label: 'Training Reach',
        value: attendeeCoverage,
        detail: 'Approved attendee count',
        tone: 'warning',
        progress: null
      },
      {
        key: 'compliancePercentage',
        label: 'Compliance Score',
        value: Number(compliancePercentage.toFixed(1)),
        detail: 'Average approved inspection score',
        tone: 'success',
        progress: compliancePercentage
      }
    ],
    siteCompliance
  };
};

const getDashboardMetrics = async (user) => {
  const { role, siteScope } = getDashboardScope(user);

  if (role === ROLES.TOP_MANAGEMENT) {
    return getManagementMetrics();
  }

  if (role === ROLES.HQ_SAFETY_OFFICER) {
    return getHqMetrics(siteScope);
  }

  return getFieldMetrics(user, siteScope);
};

const getWorkflowAlerts = async (user) => {
  const { siteScope } = getDashboardScope(user);
  return getAlertFeed(siteScope);
};

const getHighRiskSites = async (user) => {
  const { siteScope } = getDashboardScope(user);
  const fallbackSites = await getScopeSites(siteScope, 4);
  return getSiteStatus(siteScope, fallbackSites);
};

const getRecentIncidents = async (user) => {
  const { siteScope } = getDashboardScope(user);
  return getRecentIncidentFeed(siteScope);
};

const getPendingApprovals = async (user) => {
  const { siteScope } = getDashboardScope(user);
  return getPendingApprovalFeed(siteScope);
};

const getRecentActivity = async (user) => {
  const { siteScope } = getDashboardScope(user);
  return getRecentActivityFeed(siteScope);
};

const getDashboard = async (user) => {
  const { role, siteScope } = getDashboardScope(user);
  const [metricsPayload, workflow, alerts, siteStatus] = await Promise.all([
    getDashboardMetrics(user),
    getWorkflowQueue(siteScope),
    getAlertFeed(siteScope),
    getHighRiskSites(user)
  ]);

  return buildDashboardPayload({
    role,
    summary: metricsPayload.summary,
    primaryMetrics: metricsPayload.metrics,
    siteCompliance: metricsPayload.siteCompliance,
    workflow,
    alerts,
    siteStatus
  });
};

module.exports = {
  getDashboard,
  getDashboardMetrics,
  getRecentIncidents,
  getPendingApprovals,
  getWorkflowAlerts,
  getHighRiskSites,
  getRecentActivity
};
