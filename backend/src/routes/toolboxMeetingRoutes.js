const createModuleController = require('../controllers/createModuleController');
const createModuleRoutes = require('./createModuleRoutes');
const { toolboxMeetingService } = require('../services/phaseModules');
const {
  toolboxMeetingSchema,
  toolboxMeetingUpdateSchema,
  recordTransitionSchema
} = require('../validators/phaseModuleValidator');

module.exports = createModuleRoutes(
  createModuleController(toolboxMeetingService, { singular: 'Toolbox meeting', plural: 'Toolbox meetings' }),
  {
    create: toolboxMeetingSchema,
    update: toolboxMeetingUpdateSchema,
    transition: recordTransitionSchema
  }
);
