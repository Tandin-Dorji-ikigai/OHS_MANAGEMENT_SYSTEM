const asyncHandler = require('../utils/asyncHandler');
const { success } = require('../utils/apiResponse');
const notificationQueryService = require('../services/notificationQueryService');

const listNotifications = asyncHandler(async (req, res) => {
  const data = await notificationQueryService.listNotifications(req.user.id);
  success(res, data, 'Notifications retrieved');
});

const markAsRead = asyncHandler(async (req, res) => {
  const data = await notificationQueryService.markNotificationRead(req.params.id, req.user.id);
  success(res, data, 'Notification updated');
});

module.exports = {
  listNotifications,
  markAsRead
};
