const { verifyAccessToken } = require('../utils/tokens');
const { User, Role, Site } = require('../models');
const AppError = require('../utils/AppError');
const {
  ACCESS_COOKIE_NAME,
  getCookie
} = require('../utils/cookies');

const authenticate = async (req, _res, next) => {
  const authHeader = req.headers.authorization;
  const bearerToken =
    authHeader && authHeader.startsWith('Bearer ')
      ? authHeader.split(' ')[1]
      : null;
  const cookieToken = getCookie(req, ACCESS_COOKIE_NAME);
  const accessToken = bearerToken || cookieToken;

  if (!accessToken) {
    return next(new AppError('Authentication required', 401));
  }

  try {
    const decoded = verifyAccessToken(accessToken);
    const user = await User.findByPk(decoded.id, {
      include: [
        { model: Role, as: 'role' },
        { model: Site, as: 'sites', through: { attributes: [] } }
      ]
    });

    if (!user || !user.isActive) {
      throw new AppError('User account is inactive or missing', 401);
    }

    req.user = {
      id: user.id,
      email: user.email,
      roleId: user.roleId,
      roleName: user.role.name,
      siteIds: user.sites.map((site) => site.id)
    };

    return next();
  } catch (error) {
    return next(error.statusCode ? error : new AppError('Invalid or expired token', 401));
  }
};

module.exports = {
  authenticate
};
