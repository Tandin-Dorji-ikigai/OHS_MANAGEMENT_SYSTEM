const createModuleController = require('../controllers/createModuleController');
const createModuleRoutes = require('./createModuleRoutes');
const { trainingService } = require('../services/phaseModules');
const { trainingSchema, trainingUpdateSchema, recordTransitionSchema } = require('../validators/phaseModuleValidator');

module.exports = createModuleRoutes(
  createModuleController(trainingService, { singular: 'Training', plural: 'Trainings' }),
  {
    create: trainingSchema,
    update: trainingUpdateSchema,
    transition: recordTransitionSchema
  }
);
