const createModuleController = require('../controllers/createModuleController');
const createModuleRoutes = require('./createModuleRoutes');
const { correctiveActionService } = require('../services/phaseModules');
const {
  correctiveActionSchema,
  correctiveActionUpdateSchema,
  actionTransitionSchema
} = require('../validators/phaseModuleValidator');

module.exports = createModuleRoutes(
  createModuleController(correctiveActionService, { singular: 'Corrective action', plural: 'Corrective actions' }),
  {
    create: correctiveActionSchema,
    update: correctiveActionUpdateSchema,
    transition: actionTransitionSchema
  }
);
