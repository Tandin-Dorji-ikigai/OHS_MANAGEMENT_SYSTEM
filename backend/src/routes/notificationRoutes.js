const express = require('express');
const { authenticate } = require('../middleware/auth');
const notificationController = require('../controllers/notificationController');

const router = express.Router();

router.use(authenticate);
router.get('/', notificationController.listNotifications);
router.patch('/:id/read', notificationController.markAsRead);

module.exports = router;
