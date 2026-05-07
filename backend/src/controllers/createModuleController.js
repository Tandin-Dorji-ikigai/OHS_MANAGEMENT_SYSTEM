const asyncHandler = require('../utils/asyncHandler');
const { paginated, success } = require('../utils/apiResponse');

const createModuleController = (service, labels) => ({
  list: asyncHandler(async (req, res) => {
    const data = await service.list(req.query, req.user);
    paginated(res, data.items, data.pagination, `${labels.plural} retrieved`);
  }),
  getById: asyncHandler(async (req, res) => {
    const data = await service.getById(req.params.id, req.user);
    success(res, data, `${labels.singular} retrieved`);
  }),
  create: asyncHandler(async (req, res) => {
    const data = await service.create(req.body, req.user);
    success(res, data, `${labels.singular} created`, 201);
  }),
  update: asyncHandler(async (req, res) => {
    const data = await service.update(req.params.id, req.body, req.user);
    success(res, data, `${labels.singular} updated`);
  }),
  transition: asyncHandler(async (req, res) => {
    const data = await service.transition(req.params.id, req.body, req.user);
    success(res, data, `${labels.singular} workflow updated`);
  }),
  remove: asyncHandler(async (req, res) => {
    await service.remove(req.params.id, req.user);
    success(res, null, `${labels.singular} deleted`);
  })
});

module.exports = createModuleController;
