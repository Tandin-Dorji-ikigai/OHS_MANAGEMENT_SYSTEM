const asyncHandler = require('../utils/asyncHandler');
const { paginated, success } = require('../utils/apiResponse');
const userService = require('../services/userService');

const listUsers = asyncHandler(async (req, res) => {
  const data = await userService.listUsers(req.query);
  paginated(res, data.items, data.pagination, 'Users retrieved');
});

const getUserOptions = asyncHandler(async (_req, res) => {
  const data = await userService.getUserOptions();
  success(res, data, 'User options retrieved');
});

const createUser = asyncHandler(async (req, res) => {
  const data = await userService.createUser(req.body, req.user.id);
  success(res, data, 'User created', 201);
});

const updateUser = asyncHandler(async (req, res) => {
  const data = await userService.updateUser(req.params.id, req.body, req.user.id);
  success(res, data, 'User updated');
});

module.exports = {
  listUsers,
  getUserOptions,
  createUser,
  updateUser
};
