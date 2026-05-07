const asyncHandler = require('../utils/asyncHandler');
const { success } = require('../utils/apiResponse');
const attachmentService = require('../services/attachmentService');

const uploadAttachment = asyncHandler(async (req, res) => {
  const data = await attachmentService.createAttachment({
    file: req.file,
    uploadedBy: req.user.id,
    moduleName: req.body.moduleName,
    recordId: req.body.recordId,
    siteId: req.body.siteId || null
  });
  success(res, data, 'Attachment uploaded', 201);
});

const listAttachments = asyncHandler(async (req, res) => {
  const data = await attachmentService.listAttachments(req.query.moduleName, req.query.recordId);
  success(res, data, 'Attachments retrieved');
});

module.exports = {
  uploadAttachment,
  listAttachments
};
