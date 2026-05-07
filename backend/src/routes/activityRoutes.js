const createModuleController = require('../controllers/createModuleController');
const createModuleRoutes = require('./createModuleRoutes');
const { activityService } = require('../services/phaseModules');
const { activitySchema, activityUpdateSchema, recordTransitionSchema } = require('../validators/phaseModuleValidator');

module.exports = createModuleRoutes(
  createModuleController(activityService, { singular: 'Activity', plural: 'Activities' }),
  {
    create: activitySchema,
    update: activityUpdateSchema,
    transition: recordTransitionSchema
  }
);
