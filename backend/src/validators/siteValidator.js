const Joi = require('joi');

const siteSchema = Joi.object({
  code: Joi.string().max(50).required(),
  name: Joi.string().max(150).required(),
  region: Joi.string().max(100).allow('', null),
  country: Joi.string().max(100).allow('', null),
  address: Joi.string().allow('', null),
  latitude: Joi.number().allow(null),
  longitude: Joi.number().allow(null),
  siteType: Joi.string().max(100).allow('', null),
  isActive: Joi.boolean().default(true)
});

const siteUpdateSchema = Joi.object({
  code: Joi.string().max(50),
  name: Joi.string().max(150),
  region: Joi.string().max(100).allow('', null),
  country: Joi.string().max(100).allow('', null),
  address: Joi.string().allow('', null),
  latitude: Joi.number().allow(null),
  longitude: Joi.number().allow(null),
  siteType: Joi.string().max(100).allow('', null),
  isActive: Joi.boolean()
}).min(1);

module.exports = {
  siteSchema,
  siteUpdateSchema
};
