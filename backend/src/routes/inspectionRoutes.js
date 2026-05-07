const express = require('express');
const inspectionController = require('../controllers/inspectionController');
const { authenticate } = require('../middleware/auth');
const { validate } = require('../middleware/validate');
const {
  inspectionSchema,
  inspectionUpdateSchema,
  inspectionTransitionSchema
} = require('../validators/inspectionValidator');

const router = express.Router();

router.use(authenticate);
router.get('/', inspectionController.listInspections);
router.get('/:id', inspectionController.getInspection);
router.post('/', validate(inspectionSchema), inspectionController.createInspection);
router.patch('/:id', validate(inspectionUpdateSchema), inspectionController.updateInspection);
router.post('/:id/transition', validate(inspectionTransitionSchema), inspectionController.transitionInspection);

module.exports = router;
