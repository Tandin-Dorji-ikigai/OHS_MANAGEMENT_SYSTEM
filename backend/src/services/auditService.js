const { AuditLog, ApprovalLog } = require('../models');

const logAudit = async ({ moduleName, recordId, action, comments, metadata, actionBy }) =>
  AuditLog.create({
    moduleName,
    recordId,
    action,
    comments,
    metadata,
    actionBy
  });

const logApproval = async ({ moduleName, recordId, action, fromStatus, toStatus, comments, actionBy }) =>
  ApprovalLog.create({
    moduleName,
    recordId,
    action,
    fromStatus,
    toStatus,
    comments,
    actionBy
  });

const getRecordHistory = async (moduleName, recordId) => {
  const [approvalLogs, auditLogs] = await Promise.all([
    ApprovalLog.findAll({ where: { moduleName, recordId }, order: [['createdAt', 'DESC']] }),
    AuditLog.findAll({ where: { moduleName, recordId }, order: [['createdAt', 'DESC']] })
  ]);

  return { approvalLogs, auditLogs };
};

module.exports = {
  logAudit,
  logApproval,
  getRecordHistory
};
