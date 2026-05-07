const Joi = require('joi');

const inspectionItemSchema = Joi.object({
  checklistText: Joi.string().max(255).required(),
  isCompliant: Joi.boolean().required(),
  comments: Joi.string().allow('', null),
  sortOrder: Joi.number().integer().min(0).default(0)
});

const inspectionFindingSchema = Joi.object({
  title: Joi.string().max(180).required(),
  description: Joi.string().required(),
  recommendation: Joi.string().allow('', null),
  priority: Joi.string().valid('low', 'medium', 'high', 'critical').default('medium'),
  actionRequired: Joi.boolean().default(true)
});

const inspectionSchema = Joi.object({
  title: Joi.string().max(180).required(),
  siteId: Joi.string().uuid().required(),
  scheduleDate: Joi.date().iso().allow(null),
  inspectionDate: Joi.date().iso().allow(null),
  templateName: Joi.string().max(120).allow('', null),
  observations: Joi.string().allow('', null),
  recommendations: Joi.string().allow('', null),
  items: Joi.array().items(inspectionItemSchema).min(1).required(),
  findings: Joi.array().items(inspectionFindingSchema).default([])
});

const inspectionUpdateSchema = Joi.object({
  title: Joi.string().max(180),
  siteId: Joi.string().uuid(),
  scheduleDate: Joi.date().iso().allow(null),
  inspectionDate: Joi.date().iso().allow(null),
  templateName: Joi.string().max(120).allow('', null),
  observations: Joi.string().allow('', null),
  recommendations: Joi.string().allow('', null),
  items: Joi.array().items(inspectionItemSchema).min(1),
  findings: Joi.array().items(inspectionFindingSchema)
}).min(1);

const inspectionTransitionSchema = Joi.object({
  status: Joi.string()
    .valid('submitted', 'under_review', 'returned_for_correction', 'validated', 'approved', 'rejected', 'closed', 'draft')
    .required(),
  comments: Joi.string().allow('', null)
});

module.exports = {
  inspectionSchema,
  inspectionUpdateSchema,
  inspectionTransitionSchema
};
