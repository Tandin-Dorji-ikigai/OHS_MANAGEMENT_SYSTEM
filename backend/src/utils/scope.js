const { Op } = require('sequelize');
const { ROLES } = require('../constants/roles');

const buildSiteScopeWhere = (user, siteField = 'siteId') => {
  if (!user || [ROLES.HQ_SAFETY_OFFICER, ROLES.TOP_MANAGEMENT].includes(user.roleName)) {
    return {};
  }

  return {
    [siteField]: {
      [Op.in]: user.siteIds?.length ? user.siteIds : ['00000000-0000-0000-0000-000000000000']
    }
  };
};

module.exports = {
  buildSiteScopeWhere
};
