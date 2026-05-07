const express = require('express');
const { authenticate } = require('../middleware/auth');
const dashboardController = require('../controllers/dashboardController');

const router = express.Router();

router.use(authenticate);
router.get('/metrics', dashboardController.getDashboardMetrics);
router.get('/recent-incidents', dashboardController.getRecentIncidents);
router.get('/pending-approvals', dashboardController.getPendingApprovals);
router.get('/workflow-alerts', dashboardController.getWorkflowAlerts);
router.get('/high-risk-sites', dashboardController.getHighRiskSites);
router.get('/recent-activity', dashboardController.getRecentActivity);
router.get('/', dashboardController.getDashboard);

module.exports = router;
