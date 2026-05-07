const Joi = require('joi');

const incidentSchema = Joi.object({
  siteId: Joi.string().uuid().required(),
  incidentType: Joi.string().valid('accident', 'near_miss', 'unsafe_condition', 'unsafe_act').required(),
  severity: Joi.string().valid('minor', 'moderate', 'major', 'critical').required(),
  eventDate: Joi.date().iso().required(),
  location: Joi.string().max(180).required(),
  peopleInvolved: Joi.array().items(Joi.object({ name: Joi.string().required(), role: Joi.string().allow('', null) })).default([]),
  description: Joi.string().required(),
  immediateActions: Joi.string().allow('', null),
  rootCause: Joi.string().allow('', null),
  recommendedActions: Joi.string().allow('', null),
  assignedTo: Joi.string().uuid().allow(null),
  dueDate: Joi.date().iso().allow(null)
});

const incidentUpdateSchema = Joi.object({
  siteId: Joi.string().uuid(),
  incidentType: Joi.string().valid('accident', 'near_miss', 'unsafe_condition', 'unsafe_act'),
  severity: Joi.string().valid('minor', 'moderate', 'major', 'critical'),
  eventDate: Joi.date().iso(),
  location: Joi.string().max(180),
  peopleInvolved: Joi.array().items(Joi.object({ name: Joi.string().required(), role: Joi.string().allow('', null) })),
  description: Joi.string(),
  immediateActions: Joi.string().allow('', null),
  rootCause: Joi.string().allow('', null),
  recommendedActions: Joi.string().allow('', null),
  assignedTo: Joi.string().uuid().allow(null),
  dueDate: Joi.date().iso().allow(null)
}).min(1);

const incidentAssignmentSchema = Joi.object({
  investigatorId: Joi.string().uuid().required(),
  investigationPriority: Joi.string().valid('low', 'medium', 'high', 'critical').allow(null),
  investigationDueDate: Joi.date().iso().allow(null),
  comments: Joi.string().allow('', null)
});

const incidentTransitionSchema = Joi.object({
  status: Joi.string()
    .valid('submitted', 'under_review', 'returned_for_correction', 'validated', 'approved', 'rejected', 'closed', 'draft')
    .required(),
  comments: Joi.string().allow('', null)
});

const incidentManagementReviewSchema = Joi.object({
  managementReviewComments: Joi.string().required(),
  escalate: Joi.boolean().default(false),
  escalationReason: Joi.string().allow('', null)
});

const investigationSchema = Joi.object({
  investigationDate: Joi.date().iso().required(),
  findings: Joi.string().required(),
  rootCauseAnalysis: Joi.string().allow('', null),
  recommendations: Joi.string().allow('', null)
});

const incidentEscalationSchema = Joi.object({
  escalationType: Joi.string().max(80).required(),
  escalationLevel: Joi.string().max(80).required(),
  reason: Joi.string().required(),
  metadata: Joi.object().unknown(true).default({})
});

module.exports = {
  incidentSchema,
  incidentUpdateSchema,
  incidentAssignmentSchema,
  incidentTransitionSchema,
  incidentManagementReviewSchema,
  incidentEscalationSchema,
  investigationSchema
};
