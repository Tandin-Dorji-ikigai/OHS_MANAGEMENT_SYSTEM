const { Op } = require('sequelize');
const { User, Role, Site } = require('../models');
const AppError = require('../utils/AppError');
const { getPagination, getPagingData } = require('../utils/pagination');
const { hashPassword } = require('../utils/password');
const { logAudit } = require('./auditService');

const formatRoleLabel = (roleName) =>
  roleName
    .split('_')
    .map((segment) => segment[0] + segment.slice(1).toLowerCase())
    .join(' ');

const listUsers = async (query) => {
  const { page, limit, offset } = getPagination(query);
  const where = {};

  if (query.search) {
    where[Op.or] = [
      { firstName: { [Op.like]: `%${query.search}%` } },
      { lastName: { [Op.like]: `%${query.search}%` } },
      { email: { [Op.like]: `%${query.search}%` } }
    ];
  }

  if (query.isActive !== undefined) {
    where.isActive = query.isActive === 'true';
  }

  const { rows, count } = await User.findAndCountAll({
    where,
    include: [
      { model: Role, as: 'role' },
      { model: Site, as: 'sites', through: { attributes: [] } }
    ],
    limit,
    offset,
    order: [['createdAt', 'DESC']]
  });

  return {
    items: rows,
    pagination: getPagingData(count, page, limit)
  };
};

const getUserOptions = async () => {
  const [roles, sites] = await Promise.all([
    Role.findAll({
      order: [['name', 'ASC']]
    }),
    Site.findAll({
      where: { isActive: true },
      attributes: ['id', 'code', 'name', 'region'],
      order: [['name', 'ASC']]
    })
  ]);

  return {
    roles: roles.map((role) => ({
      id: role.id,
      name: role.name,
      label: formatRoleLabel(role.name),
      description: role.description
    })),
    sites
  };
};

const createUser = async (payload, actorId) => {
  const existing = await User.findOne({ where: { email: payload.email } });
  if (existing) {
    throw new AppError('Email already in use', 409);
  }

  const user = await User.create({
    ...payload,
    passwordHash: await hashPassword(payload.password)
  });

  if (payload.siteIds?.length) {
    await user.setSites(payload.siteIds);
  }

  const created = await User.findByPk(user.id, {
    include: [{ model: Role, as: 'role' }, { model: Site, as: 'sites', through: { attributes: [] } }]
  });

  await logAudit({
    moduleName: 'user',
    recordId: user.id,
    action: 'create',
    comments: 'User created',
    actionBy: actorId
  });

  return created;
};

const updateUser = async (id, payload, actorId) => {
  const user = await User.findByPk(id);
  if (!user) {
    throw new AppError('User not found', 404);
  }

  const updatePayload = { ...payload };
  delete updatePayload.siteIds;

  await user.update(updatePayload);
  if (payload.siteIds) {
    await user.setSites(payload.siteIds);
  }

  await logAudit({
    moduleName: 'user',
    recordId: user.id,
    action: 'update',
    comments: 'User updated',
    actionBy: actorId
  });

  return User.findByPk(id, {
    include: [{ model: Role, as: 'role' }, { model: Site, as: 'sites', through: { attributes: [] } }]
  });
};

module.exports = {
  listUsers,
  getUserOptions,
  createUser,
  updateUser
};
