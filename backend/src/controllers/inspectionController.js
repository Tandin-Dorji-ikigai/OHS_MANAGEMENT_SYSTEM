const asyncHandler = require('../utils/asyncHandler');
const { paginated, success } = require('../utils/apiResponse');
const inspectionService = require('../services/inspectionService');

const listInspections = asyncHandler(async (req, res) => {
  const data = await inspectionService.listInspections(req.query, req.user);
  paginated(res, data.items, data.pagination, 'Inspections retrieved');
});

const getInspection = asyncHandler(async (req, res) => {
  const data = await inspectionService.getInspectionById(req.params.id, req.user);
  success(res, data, 'Inspection retrieved');
});

const createInspection = asyncHandler(async (req, res) => {
  const data = await inspectionService.createInspection(req.body, req.user);
  success(res, data, 'Inspection created', 201);
});

const updateInspection = asyncHandler(async (req, res) => {
  const data = await inspectionService.updateInspection(req.params.id, req.body, req.user);
  success(res, data, 'Inspection updated');
});

const transitionInspection = asyncHandler(async (req, res) => {
  const data = await inspectionService.transitionInspection(req.params.id, req.body, req.user);
  success(res, data, 'Inspection workflow updated');
});

module.exports = {
  listInspections,
  getInspection,
  createInspection,
  updateInspection,
  transitionInspection
};
