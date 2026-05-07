const asyncHandler = require('../utils/asyncHandler');
const { success } = require('../utils/apiResponse');
const dashboardService = require('../services/dashboardService');

const getDashboard = asyncHandler(async (req, res) => {
  const data = await dashboardService.getDashboard(req.user);
  success(res, data, 'Dashboard retrieved');
});

const getDashboardMetrics = asyncHandler(async (req, res) => {
  const data = await dashboardService.getDashboardMetrics(req.user);
  success(res, data, 'Dashboard metrics retrieved');
});

const getRecentIncidents = asyncHandler(async (req, res) => {
  const data = await dashboardService.getRecentIncidents(req.user);
  success(res, data, 'Recent incidents retrieved');
});

const getPendingApprovals = asyncHandler(async (req, res) => {
  const data = await dashboardService.getPendingApprovals(req.user);
  success(res, data, 'Pending approvals retrieved');
});

const getWorkflowAlerts = asyncHandler(async (req, res) => {
  const data = await dashboardService.getWorkflowAlerts(req.user);
  success(res, data, 'Workflow alerts retrieved');
});

const getHighRiskSites = asyncHandler(async (req, res) => {
  const data = await dashboardService.getHighRiskSites(req.user);
  success(res, data, 'High-risk sites retrieved');
});

const getRecentActivity = asyncHandler(async (req, res) => {
  const data = await dashboardService.getRecentActivity(req.user);
  success(res, data, 'Recent activity retrieved');
});

module.exports = {
  getDashboard,
  getDashboardMetrics,
  getRecentIncidents,
  getPendingApprovals,
  getWorkflowAlerts,
  getHighRiskSites,
  getRecentActivity
};
