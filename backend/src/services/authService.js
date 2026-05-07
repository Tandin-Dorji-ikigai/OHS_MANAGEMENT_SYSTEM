const { Op } = require('sequelize');
const { User, Role, Site, RefreshToken } = require('../models');
const AppError = require('../utils/AppError');
const { comparePassword, hashPassword } = require('../utils/password');
const { signAccessToken, signRefreshToken, verifyRefreshToken } = require('../utils/tokens');
const { ROLES } = require('../constants/roles');

const formatUser = (user) => ({
  id: user.id,
  firstName: user.firstName,
  lastName: user.lastName,
  email: user.email,
  department: user.department,
  teamName: user.teamName,
  role: user.role?.name,
  sites: user.sites?.map((site) => ({
    id: site.id,
    code: site.code,
    name: site.name,
    region: site.region
  })) || []
});

const buildTokens = async (user) => {
  const payload = {
    id: user.id,
    roleName: user.role.name
  };
  const accessToken = signAccessToken(payload);
  const refreshToken = signRefreshToken(payload);

  await RefreshToken.create({
    userId: user.id,
    token: refreshToken,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  });

  return { accessToken, refreshToken };
};

const revokeRefreshToken = async (refreshToken) => {
  if (!refreshToken) {
    return;
  }

  await RefreshToken.update(
    { isRevoked: true },
    { where: { token: refreshToken } }
  );
};

const login = async ({ email, password }) => {
  const user = await User.findOne({
    where: { email },
    include: [
      { model: Role, as: 'role' },
      { model: Site, as: 'sites', through: { attributes: [] } }
    ]
  });

  if (!user || !user.isActive) {
    throw new AppError('Invalid email or password', 401);
  }

  const matches = await comparePassword(password, user.passwordHash);
  if (!matches) {
    throw new AppError('Invalid email or password', 401);
  }

  await user.update({ lastLoginAt: new Date() });
  const tokens = await buildTokens(user);

  return {
    user: formatUser(user),
    tokens
  };
};

const getRegistrationOptions = async () => {
  const [roles, sites] = await Promise.all([
    Role.findAll({
      where: {
        name: {
          [Op.in]: [ROLES.FIELD_SAFETY_OFFICER, ROLES.SAFETY_SUPERVISOR]
        }
      },
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
      label: role.name
        .split('_')
        .map((segment) => segment[0] + segment.slice(1).toLowerCase())
        .join(' ')
    })),
    sites
  };
};

const register = async ({ confirmPassword, roleName, siteIds, ...payload }) => {
  const existing = await User.findOne({ where: { email: payload.email } });
  if (existing) {
    throw new AppError('Email already in use', 409);
  }

  const uniqueSiteIds = [...new Set(siteIds)];
  const [role, sites] = await Promise.all([
    Role.findOne({ where: { name: roleName } }),
    Site.findAll({
      where: {
        id: {
          [Op.in]: uniqueSiteIds
        },
        isActive: true
      }
    })
  ]);

  if (!role) {
    throw new AppError('Selected role is unavailable', 400);
  }

  if (sites.length !== uniqueSiteIds.length) {
    throw new AppError('One or more selected sites are invalid', 400);
  }

  const user = await User.create({
    ...payload,
    roleId: role.id,
    passwordHash: await hashPassword(payload.password),
    isActive: true
  });

  await user.setSites(uniqueSiteIds);

  const created = await User.findByPk(user.id, {
    include: [
      { model: Role, as: 'role' },
      { model: Site, as: 'sites', through: { attributes: [] } }
    ]
  });

  const tokens = await buildTokens(created);

  return {
    user: formatUser(created),
    tokens
  };
};

const refresh = async ({ refreshToken }) => {
  if (!refreshToken) {
    throw new AppError('Refresh token is missing', 401);
  }

  verifyRefreshToken(refreshToken);

  const stored = await RefreshToken.findOne({
    where: { token: refreshToken, isRevoked: false },
    include: [{ model: User, as: 'user', include: [{ model: Role, as: 'role' }] }]
  });

  if (!stored || stored.expiresAt < new Date()) {
    throw new AppError('Refresh token is invalid or expired', 401);
  }

  const accessToken = signAccessToken({
    id: stored.user.id,
    roleName: stored.user.role.name
  });

  return { accessToken };
};

const logout = async (refreshToken) => {
  await revokeRefreshToken(refreshToken);
};

const getProfile = async (userId) => {
  const user = await User.findByPk(userId, {
    include: [
      { model: Role, as: 'role' },
      { model: Site, as: 'sites', through: { attributes: [] } }
    ]
  });
  if (!user) {
    throw new AppError('User not found', 404);
  }
  return formatUser(user);
};

module.exports = {
  login,
  getRegistrationOptions,
  register,
  refresh,
  logout,
  getProfile
};
