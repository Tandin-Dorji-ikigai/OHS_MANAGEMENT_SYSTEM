const AppError = require('./AppError');

const WORKFLOW_TRANSITIONS = {
  draft: ['submitted'],
  submitted: ['under_review', 'returned_for_correction', 'validated', 'rejected'],
  under_review: ['returned_for_correction', 'validated', 'rejected'],
  returned_for_correction: ['draft', 'submitted'],
  validated: ['approved', 'returned_for_correction', 'rejected'],
  approved: ['closed'],
  rejected: [],
  closed: []
};

const ACTION_WORKFLOW_TRANSITIONS = {
  open: ['in_progress', 'overdue'],
  in_progress: ['pending_verification', 'overdue'],
  pending_verification: ['closed', 'in_progress', 'overdue'],
  closed: [],
  overdue: ['in_progress', 'pending_verification']
};

const ensureTransitionAllowed = (fromStatus, toStatus, isAction = false) => {
  const graph = isAction ? ACTION_WORKFLOW_TRANSITIONS : WORKFLOW_TRANSITIONS;
  if (!(graph[fromStatus] || []).includes(toStatus)) {
    throw new AppError(`Transition from ${fromStatus} to ${toStatus} is not allowed`, 400);
  }
};

module.exports = {
  WORKFLOW_TRANSITIONS,
  ACTION_WORKFLOW_TRANSITIONS,
  ensureTransitionAllowed
};
