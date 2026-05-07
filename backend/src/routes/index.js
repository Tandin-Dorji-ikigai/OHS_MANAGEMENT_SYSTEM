const express = require('express');
const authRoutes = require('./authRoutes');
const userRoutes = require('./userRoutes');
const siteRoutes = require('./siteRoutes');
const inspectionRoutes = require('./inspectionRoutes');
const incidentRoutes = require('./incidentRoutes');
const dashboardRoutes = require('./dashboardRoutes');
const notificationRoutes = require('./notificationRoutes');
const attachmentRoutes = require('./attachmentRoutes');
const riskAssessmentRoutes = require('./riskAssessmentRoutes');
const trainingRoutes = require('./trainingRoutes');
const toolboxMeetingRoutes = require('./toolboxMeetingRoutes');
const activityRoutes = require('./activityRoutes');
const ohsPlanRoutes = require('./ohsPlanRoutes');
const correctiveActionRoutes = require('./correctiveActionRoutes');

const router = express.Router();

router.get('/health', (_req, res) => {
  res.json({ success: true, message: 'OHS API healthy' });
});

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/sites', siteRoutes);
router.use('/inspections', inspectionRoutes);
router.use('/incidents', incidentRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/notifications', notificationRoutes);
router.use('/attachments', attachmentRoutes);
router.use('/risks', riskAssessmentRoutes);
router.use('/trainings', trainingRoutes);
router.use('/toolbox-meetings', toolboxMeetingRoutes);
router.use('/activities', activityRoutes);
router.use('/plans', ohsPlanRoutes);
router.use('/actions', correctiveActionRoutes);

module.exports = router;
