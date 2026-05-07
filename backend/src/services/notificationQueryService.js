const { Notification } = require('../models');

const listNotifications = async (userId) =>
  Notification.findAll({
    where: { userId },
    order: [['createdAt', 'DESC']],
    limit: 50
  });

const markNotificationRead = async (id, userId) => {
  const notification = await Notification.findOne({ where: { id, userId } });
  if (!notification) {
    return null;
  }
  await notification.update({ isRead: true, readAt: new Date() });
  return notification;
};

module.exports = {
  listNotifications,
  markNotificationRead
};
