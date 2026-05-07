const express = require('express');
const incidentController = require('../controllers/incidentController');
const { authenticate } = require('../middleware/auth');
const { validate } = require('../middleware/validate');
const {
  incidentSchema,
  incidentUpdateSchema,
  incidentAssignmentSchema,
  incidentTransitionSchema,
  incidentManagementReviewSchema,
  incidentEscalationSchema,
  investigationSchema
} = require('../validators/incidentValidator');

const router = express.Router();

router.use(authenticate);
router.get('/', incidentController.listIncidents);
router.get('/:id', incidentController.getIncident);
router.post('/', validate(incidentSchema), incidentController.createIncident);
router.patch('/:id', validate(incidentUpdateSchema), incidentController.updateIncident);
router.post('/:id/assign-investigator', validate(incidentAssignmentSchema), incidentController.assignInvestigator);
router.post('/:id/investigations', validate(investigationSchema), incidentController.addInvestigation);
router.post('/:id/management-review', validate(incidentManagementReviewSchema), incidentController.saveManagementReview);
router.post('/:id/escalations', validate(incidentEscalationSchema), incidentController.createEscalation);
router.post('/:id/transition', validate(incidentTransitionSchema), incidentController.transitionIncident);

module.exports = router;
