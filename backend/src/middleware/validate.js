const AppError = require('../utils/AppError');

const validate = (schema, target = 'body') => (req, _res, next) => {
  const { error, value } = schema.validate(req[target], {
    abortEarly: false,
    stripUnknown: true
  });

  if (error) {
    return next(new AppError('Validation failed', 422, error.details));
  }

  req[target] = value;
  return next();
};

module.exports = {
  validate
};
