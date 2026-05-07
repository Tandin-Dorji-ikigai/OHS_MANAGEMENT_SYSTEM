const express = require('express');
const { authenticate } = require('../middleware/auth');
const { upload } = require('../middleware/upload');
const attachmentController = require('../controllers/attachmentController');

const router = express.Router();

router.use(authenticate);
router.get('/', attachmentController.listAttachments);
router.post('/', upload.single('file'), attachmentController.uploadAttachment);

module.exports = router;
