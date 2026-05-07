const express = require('express');
const incidentController = require('../controllers/incidentController');
const { authenticate } = require('../middleware/auth');
const { validate } = require('../middleware/validate');
const {
  incidentSchema,
  incidentUpdateSchema,
  incidentTransitionSchema,
  investigationSchema
} = require('../validators/incidentValidator');

const router = express.Router();

router.use(authenticate);
router.get('/', incidentController.listIncidents);
router.get('/:id', incidentController.getIncident);
router.post('/', validate(incidentSchema), incidentController.createIncident);
router.patch('/:id', validate(incidentUpdateSchema), incidentController.updateIncident);
router.post('/:id/investigations', validate(investigationSchema), incidentController.addInvestigation);
router.post('/:id/transition', validate(incidentTransitionSchema), incidentController.transitionIncident);

module.exports = router;
