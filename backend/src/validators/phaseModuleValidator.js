const Joi = require('joi');
const { ACTION_STATUSES, PRIORITIES, RECORD_STATUSES } = require('../constants/workflow');

const uuid = Joi.string().uuid();
const text = (max) => Joi.string().max(max).allow('', null);

const riskItemSchema = Joi.object({
  hazard: Joi.string().max(255).required(),
  consequence: text(255),
  likelihood: Joi.number().integer().min(1).max(5).required(),
  severity: Joi.number().integer().min(1).max(5).required(),
  controlMeasures: Joi.string().required(),
  responsiblePerson: text(180)
});

const riskAssessmentSchema = Joi.object({
  siteId: uuid.required(),
  title: Joi.string().max(180).required(),
  jobTask: Joi.string().max(180).required(),
  version: Joi.number().integer().min(1).default(1),
  assessmentDate: Joi.date().iso().required(),
  nextReviewDate: Joi.date().iso().allow(null),
  items: Joi.array().items(riskItemSchema).min(1).required()
});

const riskAssessmentUpdateSchema = Joi.object({
  siteId: uuid,
  title: Joi.string().max(180),
  jobTask: Joi.string().max(180),
  version: Joi.number().integer().min(1),
  assessmentDate: Joi.date().iso(),
  nextReviewDate: Joi.date().iso().allow(null),
  items: Joi.array().items(riskItemSchema).min(1)
}).min(1);

const trainingSchema = Joi.object({
  siteId: uuid.required(),
  title: Joi.string().max(180).required(),
  topic: Joi.string().max(180).required(),
  trainerName: Joi.string().max(180).required(),
  trainingDate: Joi.date().iso().required(),
  attendees: Joi.array().items(Joi.object({ name: Joi.string().max(180).required() })).default([])
});

const trainingUpdateSchema = Joi.object({
  siteId: uuid,
  title: Joi.string().max(180),
  topic: Joi.string().max(180),
  trainerName: Joi.string().max(180),
  trainingDate: Joi.date().iso(),
  attendees: Joi.array().items(Joi.object({ name: Joi.string().max(180).required() }))
}).min(1);

const toolboxMeetingSchema = Joi.object({
  siteId: uuid.required(),
  topic: Joi.string().max(180).required(),
  facilitator: Joi.string().max(180).required(),
  meetingDate: Joi.date().iso().required(),
  attendees: Joi.array().items(Joi.object({ name: Joi.string().max(180).required() })).default([]),
  notes: Joi.string().allow('', null)
});

const toolboxMeetingUpdateSchema = Joi.object({
  siteId: uuid,
  topic: Joi.string().max(180),
  facilitator: Joi.string().max(180),
  meetingDate: Joi.date().iso(),
  attendees: Joi.array().items(Joi.object({ name: Joi.string().max(180).required() })),
  notes: Joi.string().allow('', null)
}).min(1);

const activitySchema = Joi.object({
  siteId: uuid.required(),
  activityType: Joi.string().valid('daily_log', 'weekly_log', 'awareness_session', 'committee_meeting').required(),
  title: Joi.string().max(180).required(),
  activityDate: Joi.date().iso().required(),
  summary: Joi.string().allow('', null)
});

const activityUpdateSchema = Joi.object({
  siteId: uuid,
  activityType: Joi.string().valid('daily_log', 'weekly_log', 'awareness_session', 'committee_meeting'),
  title: Joi.string().max(180),
  activityDate: Joi.date().iso(),
  summary: Joi.string().allow('', null)
}).min(1);

const planSchema = Joi.object({
  siteId: uuid.allow(null),
  title: Joi.string().max(180).required(),
  year: Joi.number().integer().min(2000).max(2100).required(),
  objective: Joi.string().required(),
  targetMetric: text(180),
  ownerName: text(180),
  dueDate: Joi.date().iso().allow(null),
  progressPercent: Joi.number().min(0).max(100).default(0)
});

const planUpdateSchema = Joi.object({
  siteId: uuid.allow(null),
  title: Joi.string().max(180),
  year: Joi.number().integer().min(2000).max(2100),
  objective: Joi.string(),
  targetMetric: text(180),
  ownerName: text(180),
  dueDate: Joi.date().iso().allow(null),
  progressPercent: Joi.number().min(0).max(100)
}).min(1);

const correctiveActionSchema = Joi.object({
  title: Joi.string().max(180).required(),
  description: Joi.string().required(),
  sourceModule: Joi.string().max(100).required(),
  sourceRecordId: uuid.required(),
  siteId: uuid.required(),
  assignedTo: uuid.allow(null),
  priority: Joi.string().valid(...PRIORITIES).default('medium'),
  dueDate: Joi.date().iso().required(),
  closureEvidence: Joi.string().allow('', null),
  verificationComments: Joi.string().allow('', null)
});

const correctiveActionUpdateSchema = Joi.object({
  title: Joi.string().max(180),
  description: Joi.string(),
  sourceModule: Joi.string().max(100),
  sourceRecordId: uuid,
  siteId: uuid,
  assignedTo: uuid.allow(null),
  priority: Joi.string().valid(...PRIORITIES),
  dueDate: Joi.date().iso(),
  closureEvidence: Joi.string().allow('', null),
  verificationComments: Joi.string().allow('', null)
}).min(1);

const recordTransitionSchema = Joi.object({
  status: Joi.string().valid(...RECORD_STATUSES).required(),
  comments: Joi.string().allow('', null)
});

const actionTransitionSchema = Joi.object({
  status: Joi.string().valid(...ACTION_STATUSES).required(),
  comments: Joi.string().allow('', null)
});

module.exports = {
  riskAssessmentSchema,
  riskAssessmentUpdateSchema,
  trainingSchema,
  trainingUpdateSchema,
  toolboxMeetingSchema,
  toolboxMeetingUpdateSchema,
  activitySchema,
  activityUpdateSchema,
  planSchema,
  planUpdateSchema,
  correctiveActionSchema,
  correctiveActionUpdateSchema,
  recordTransitionSchema,
  actionTransitionSchema
};
