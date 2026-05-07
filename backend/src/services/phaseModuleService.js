const { Op } = require('sequelize');
const AppError = require('../utils/AppError');
const { getPagination, getPagingData } = require('../utils/pagination');
const { buildSiteScopeWhere } = require('../utils/scope');
const { ensureTransitionAllowed } = require('../utils/workflow');
const { logAudit, logApproval, getRecordHistory } = require('./auditService');
const { ROLES } = require('../constants/roles');
const { createNotification } = require('./notificationService');

const actionMap = {
  submitted: 'submit',
  under_review: 'review',
  returned_for_correction: 'return',
  validated: 'validate',
  approved: 'approve',
  rejected: 'reject',
  closed: 'close',
  draft: 'review',
  in_progress: 'review',
  overdue: 'review',
  pending_verification: 'validate',
  open: 'review'
};

const ensureScopedSite = (user, siteId) => {
  const scoped = buildSiteScopeWhere(user);
  if (!scoped.siteId || !siteId) {
    return;
  }
  if (!user.siteIds.includes(siteId)) {
    throw new AppError('Record is outside your site scope', 403);
  }
};

const ensureRecordTransitionRole = (status, user) => {
  if (status === 'submitted' && user.roleName !== ROLES.SAFETY_SUPERVISOR) {
    throw new AppError('Only Safety Supervisors can submit this record', 403);
  }
  if (status === 'validated' && user.roleName !== ROLES.FIELD_SAFETY_OFFICER) {
    throw new AppError('Only Field Safety Officers can validate this record', 403);
  }
  if (['approved', 'rejected', 'closed'].includes(status) && user.roleName !== ROLES.HQ_SAFETY_OFFICER) {
    throw new AppError('Only HQ Safety Officers can perform this action', 403);
  }
};

const ensureActionTransitionRole = (record, status, user) => {
  if (user.roleName === ROLES.TOP_MANAGEMENT) {
    throw new AppError('Top management accounts cannot update corrective action workflow', 403);
  }
  if (user.roleName === ROLES.HQ_SAFETY_OFFICER) {
    return;
  }
  if (record.assignedTo && record.assignedTo !== user.id && status !== 'overdue') {
    throw new AppError('Only the assignee or HQ Safety Officer can update this action', 403);
  }
};

const buildModuleService = (config) => {
  const {
    model,
    moduleName,
    searchFields,
    listInclude = [],
    detailInclude = [],
    siteField = 'siteId',
    editableStatuses = ['draft', 'returned_for_correction'],
    isAction = false,
    prepareCreatePayload = (payload) => payload,
    prepareUpdatePayload = (payload) => payload,
    syncChildren,
    destroyChildren
  } = config;

  const buildWhere = (query, user) => {
    const where = {
      ...buildSiteScopeWhere(user, siteField)
    };

    if (query.status) {
      where.status = query.status;
    }
    if (query.search && searchFields?.length) {
      where[Op.or] = searchFields.map((field) => ({
        [field]: { [Op.like]: `%${query.search}%` }
      }));
    }
    if (query.overdue === 'true' && model.rawAttributes?.dueDate) {
      where.dueDate = { [Op.lt]: new Date() };
      where.status = { [Op.ne]: 'closed' };
    }

    return where;
  };

  const list = async (query, user) => {
    const { page, limit, offset } = getPagination(query);
    const { rows, count } = await model.findAndCountAll({
      where: buildWhere(query, user),
      include: listInclude,
      limit,
      offset,
      order: [['createdAt', 'DESC']]
    });

    return {
      items: rows,
      pagination: getPagingData(count, page, limit)
    };
  };

  const getById = async (id, user) => {
    const record = await model.findOne({
      where: { id, ...buildSiteScopeWhere(user, siteField) },
      include: detailInclude
    });

    if (!record) {
      throw new AppError(`${moduleName} not found`, 404);
    }

    const history = await getRecordHistory(moduleName, id);
    return { record, history };
  };

  const create = async (payload, user) => {
    if (payload[siteField]) {
      ensureScopedSite(user, payload[siteField]);
    }

    const createPayload = prepareCreatePayload(payload, user);
    const record = await model.create({
      ...createPayload,
      createdBy: user.id
    });

    if (syncChildren) {
      await syncChildren(record.id, payload, user);
    }

    if (isAction && record.assignedTo) {
      await createNotification({
        userId: record.assignedTo,
        title: 'Corrective action assigned',
        message: `${record.title} has been assigned to you`,
        type: 'submission_created',
        moduleName,
        recordId: record.id
      });
    }

    await logAudit({
      moduleName,
      recordId: record.id,
      action: 'create',
      comments: `${moduleName} created`,
      actionBy: user.id
    });

    return model.findByPk(record.id, { include: detailInclude });
  };

  const update = async (id, payload, user) => {
    const record = await model.findOne({
      where: { id, ...buildSiteScopeWhere(user, siteField) }
    });

    if (!record) {
      throw new AppError(`${moduleName} not found`, 404);
    }
    if (!editableStatuses.includes(record.status)) {
      throw new AppError(`Only ${editableStatuses.join(' or ')} records can be edited`, 400);
    }
    if (payload[siteField]) {
      ensureScopedSite(user, payload[siteField]);
    }

    const updatePayload = prepareUpdatePayload(payload, user);
    await record.update({
      ...updatePayload,
      updatedBy: user.id
    });

    if (syncChildren) {
      await syncChildren(id, payload, user);
    }

    if (isAction && payload.assignedTo && payload.assignedTo !== record.assignedTo) {
      await createNotification({
        userId: payload.assignedTo,
        title: 'Corrective action reassigned',
        message: `${record.title} has been reassigned to you`,
        type: 'submission_created',
        moduleName,
        recordId: id
      });
    }

    await logAudit({
      moduleName,
      recordId: id,
      action: 'update',
      comments: `${moduleName} updated`,
      actionBy: user.id
    });

    return model.findByPk(id, { include: detailInclude });
  };

  const transition = async (id, { status, comments }, user) => {
    const record = await model.findOne({
      where: { id, ...buildSiteScopeWhere(user, siteField) },
      include: detailInclude
    });

    if (!record) {
      throw new AppError(`${moduleName} not found`, 404);
    }

    const fromStatus = record.status;
    ensureTransitionAllowed(fromStatus, status, isAction);

    if (isAction) {
      ensureActionTransitionRole(record, status, user);
      if (status === 'pending_verification' && !record.closureEvidence) {
        throw new AppError('Closure evidence is required before requesting verification', 400);
      }
      if (status === 'closed') {
        if (record.status !== 'pending_verification') {
          throw new AppError('Corrective actions must be in pending verification before closure', 400);
        }
        if (user.roleName !== ROLES.HQ_SAFETY_OFFICER) {
          throw new AppError('Only HQ Safety Officers can close corrective actions', 403);
        }
        if (!record.verificationComments && !comments) {
          throw new AppError('Verification comments are required before closure', 400);
        }
      }
    } else {
      ensureRecordTransitionRole(status, user);
    }

    const updatePayload = {
      status,
      updatedBy: user.id
    };

    if (!isAction) {
      if (status === 'submitted') updatePayload.submittedAt = new Date();
      if (status === 'validated') updatePayload.validatedAt = new Date();
      if (status === 'approved') {
        updatePayload.approvedAt = new Date();
        updatePayload.approvedBy = user.id;
      }
    } else if (status === 'closed') {
      updatePayload.closedAt = new Date();
      updatePayload.verifiedBy = user.id;
    }

    await record.update(updatePayload);

    await logApproval({
      moduleName,
      recordId: id,
      action: actionMap[status] || 'review',
      fromStatus,
      toStatus: status,
      comments,
      actionBy: user.id
    });

    await logAudit({
      moduleName,
      recordId: id,
      action: `status_${status}`,
      comments,
      metadata: { fromStatus, toStatus: status },
      actionBy: user.id
    });

    return model.findByPk(id, { include: detailInclude });
  };

  const remove = async (id, user) => {
    const record = await model.findOne({
      where: { id, ...buildSiteScopeWhere(user, siteField) }
    });

    if (!record) {
      throw new AppError(`${moduleName} not found`, 404);
    }

    if (destroyChildren) {
      await destroyChildren(id);
    }

    await record.destroy();
    await logAudit({
      moduleName,
      recordId: id,
      action: 'delete',
      comments: `${moduleName} deleted`,
      actionBy: user.id
    });
  };

  return {
    list,
    getById,
    create,
    update,
    transition,
    remove
  };
};

module.exports = {
  buildModuleService
};
