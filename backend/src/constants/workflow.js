const RECORD_STATUSES = [
  'draft',
  'submitted',
  'under_review',
  'returned_for_correction',
  'validated',
  'approved',
  'rejected',
  'closed'
];

const ACTION_STATUSES = [
  'open',
  'in_progress',
  'pending_verification',
  'closed',
  'overdue'
];

const PRIORITIES = ['low', 'medium', 'high', 'critical'];
const APPROVAL_ACTIONS = ['submit', 'review', 'return', 'validate', 'approve', 'reject', 'close'];
const NOTIFICATION_TYPES = [
  'submission_created',
  'returned_for_correction',
  'approval_completed',
  'rejection_completed',
  'high_severity_incident',
  'overdue_action',
  'schedule_reminder'
];

module.exports = {
  RECORD_STATUSES,
  ACTION_STATUSES,
  PRIORITIES,
  APPROVAL_ACTIONS,
  NOTIFICATION_TYPES
};
