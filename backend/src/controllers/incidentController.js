const asyncHandler = require('../utils/asyncHandler');
const { paginated, success } = require('../utils/apiResponse');
const incidentService = require('../services/incidentService');

const listIncidents = asyncHandler(async (req, res) => {
  const data = await incidentService.listIncidents(req.query, req.user);
  paginated(res, data.items, data.pagination, 'Incidents retrieved');
});

const getIncident = asyncHandler(async (req, res) => {
  const data = await incidentService.getIncidentById(req.params.id, req.user);
  success(res, data, 'Incident retrieved');
});

const createIncident = asyncHandler(async (req, res) => {
  const data = await incidentService.createIncident(req.body, req.user);
  success(res, data, 'Incident created', 201);
});

const updateIncident = asyncHandler(async (req, res) => {
  const data = await incidentService.updateIncident(req.params.id, req.body, req.user);
  success(res, data, 'Incident updated');
});

const addInvestigation = asyncHandler(async (req, res) => {
  const data = await incidentService.addInvestigation(req.params.id, req.body, req.user);
  success(res, data, 'Investigation recorded', 201);
});

const assignInvestigator = asyncHandler(async (req, res) => {
  const data = await incidentService.assignInvestigator(req.params.id, req.body, req.user);
  success(res, data, 'Investigator assigned');
});

const saveManagementReview = asyncHandler(async (req, res) => {
  const data = await incidentService.saveManagementReview(req.params.id, req.body, req.user);
  success(res, data, 'Management review saved');
});

const createEscalation = asyncHandler(async (req, res) => {
  const data = await incidentService.createEscalation(req.params.id, req.body, req.user);
  success(res, data, 'Incident escalated', 201);
});

const transitionIncident = asyncHandler(async (req, res) => {
  const data = await incidentService.transitionIncident(req.params.id, req.body, req.user);
  success(res, data, 'Incident workflow updated');
});

module.exports = {
  listIncidents,
  getIncident,
  createIncident,
  updateIncident,
  addInvestigation,
  assignInvestigator,
  saveManagementReview,
  createEscalation,
  transitionIncident
};
