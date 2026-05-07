const Joi = require('joi');
const { ROLES } = require('../constants/roles');

const loginSchema = Joi.object({
  email: Joi.string().email({ tlds: { allow: false } }).required(),
  password: Joi.string().min(8).required()
});

const registerSchema = Joi.object({
  firstName: Joi.string().max(100).required(),
  lastName: Joi.string().max(100).required(),
  email: Joi.string().email({ tlds: { allow: false } }).required(),
  password: Joi.string().min(8).required(),
  confirmPassword: Joi.string().valid(Joi.ref('password')).required().messages({
    'any.only': 'Confirm password must match password'
  }),
  phoneNumber: Joi.string().max(30).allow('', null),
  department: Joi.string().max(100).allow('', null),
  teamName: Joi.string().max(100).allow('', null),
  roleName: Joi.string()
    .valid(ROLES.FIELD_SAFETY_OFFICER, ROLES.SAFETY_SUPERVISOR)
    .required(),
  siteIds: Joi.array().items(Joi.string().uuid()).min(1).required()
});

module.exports = {
  loginSchema,
  registerSchema
};
