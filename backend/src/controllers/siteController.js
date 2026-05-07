const asyncHandler = require('../utils/asyncHandler');
const { paginated, success } = require('../utils/apiResponse');
const siteService = require('../services/siteService');

const listSites = asyncHandler(async (req, res) => {
  const data = await siteService.listSites(req.query);
  paginated(res, data.items, data.pagination, 'Sites retrieved');
});

const createSite = asyncHandler(async (req, res) => {
  const data = await siteService.createSite(req.body, req.user.id);
  success(res, data, 'Site created', 201);
});

const updateSite = asyncHandler(async (req, res) => {
  const data = await siteService.updateSite(req.params.id, req.body, req.user.id);
  success(res, data, 'Site updated');
});

module.exports = {
  listSites,
  createSite,
  updateSite
};
