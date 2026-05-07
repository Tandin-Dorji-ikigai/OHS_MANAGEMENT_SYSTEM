const createModuleController = require('../controllers/createModuleController');
const createModuleRoutes = require('./createModuleRoutes');
const { planService } = require('../services/phaseModules');
const { planSchema, planUpdateSchema, recordTransitionSchema } = require('../validators/phaseModuleValidator');

module.exports = createModuleRoutes(
  createModuleController(planService, { singular: 'OHS plan', plural: 'OHS plans' }),
  {
    create: planSchema,
    update: planUpdateSchema,
    transition: recordTransitionSchema
  }
);
