const { Op } = require('sequelize');
const { Site } = require('../models');
const AppError = require('../utils/AppError');
const { getPagination, getPagingData } = require('../utils/pagination');
const { logAudit } = require('./auditService');

const listSites = async (query) => {
  const { page, limit, offset } = getPagination(query);
  const where = {};

  if (query.search) {
    where[Op.or] = [
      { code: { [Op.like]: `%${query.search}%` } },
      { name: { [Op.like]: `%${query.search}%` } },
      { region: { [Op.like]: `%${query.search}%` } }
    ];
  }

  const { rows, count } = await Site.findAndCountAll({
    where,
    limit,
    offset,
    order: [['name', 'ASC']]
  });

  return {
    items: rows,
    pagination: getPagingData(count, page, limit)
  };
};

const createSite = async (payload, actorId) => {
  const site = await Site.create(payload);
  await logAudit({
    moduleName: 'site',
    recordId: site.id,
    action: 'create',
    comments: 'Site created',
    actionBy: actorId
  });
  return site;
};

const updateSite = async (id, payload, actorId) => {
  const site = await Site.findByPk(id);
  if (!site) {
    throw new AppError('Site not found', 404);
  }
  await site.update(payload);
  await logAudit({
    moduleName: 'site',
    recordId: site.id,
    action: 'update',
    comments: 'Site updated',
    actionBy: actorId
  });
  return site;
};

module.exports = {
  listSites,
  createSite,
  updateSite
};
