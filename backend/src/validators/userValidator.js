const Joi = require('joi');

const createUserSchema = Joi.object({
  firstName: Joi.string().max(100).required(),
  lastName: Joi.string().max(100).required(),
  email: Joi.string().email({ tlds: { allow: false } }).required(),
  phoneNumber: Joi.string().max(30).allow('', null),
  employeeCode: Joi.string().max(50).allow('', null),
  password: Joi.string().min(8).required(),
  roleId: Joi.string().uuid().required(),
  department: Joi.string().max(100).allow('', null),
  teamName: Joi.string().max(100).allow('', null),
  isActive: Joi.boolean().default(true),
  siteIds: Joi.array().items(Joi.string().uuid()).default([])
});

const updateUserSchema = Joi.object({
  firstName: Joi.string().max(100),
  lastName: Joi.string().max(100),
  email: Joi.string().email({ tlds: { allow: false } }),
  phoneNumber: Joi.string().max(30).allow('', null),
  employeeCode: Joi.string().max(50).allow('', null),
  roleId: Joi.string().uuid(),
  department: Joi.string().max(100).allow('', null),
  teamName: Joi.string().max(100).allow('', null),
  isActive: Joi.boolean(),
  siteIds: Joi.array().items(Joi.string().uuid())
}).min(1);

module.exports = {
  createUserSchema,
  updateUserSchema
};
