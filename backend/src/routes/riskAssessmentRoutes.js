const createModuleController = require('../controllers/createModuleController');
const createModuleRoutes = require('./createModuleRoutes');
const { riskAssessmentService } = require('../services/phaseModules');
const {
  riskAssessmentSchema,
  riskAssessmentUpdateSchema,
  recordTransitionSchema
} = require('../validators/phaseModuleValidator');

module.exports = createModuleRoutes(
  createModuleController(riskAssessmentService, { singular: 'Risk assessment', plural: 'Risk assessments' }),
  {
    create: riskAssessmentSchema,
    update: riskAssessmentUpdateSchema,
    transition: recordTransitionSchema
  }
);
