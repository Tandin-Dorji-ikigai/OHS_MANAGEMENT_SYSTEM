const { Notification } = require('../models');

const createNotification = async ({ userId, title, message, type, moduleName, recordId }) =>
  Notification.create({
    userId,
    title,
    message,
    type,
    moduleName,
    recordId
  });

const notifyMany = async (userIds, payload) =>
  Promise.all(userIds.map((userId) => createNotification({ userId, ...payload })));

module.exports = {
  createNotification,
  notifyMany
};
