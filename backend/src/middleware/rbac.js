const AppError = require('../utils/AppError');

const authorizeRoles = (...roles) => (req, _res, next) => {
  if (!req.user || !roles.includes(req.user.roleName)) {
    return next(new AppError('Forbidden', 403));
  }

  return next();
};

module.exports = {
  authorizeRoles
};
