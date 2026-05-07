const { Attachment } = require('../models');

const createAttachment = async ({ file, uploadedBy, moduleName, recordId, siteId }) =>
  Attachment.create({
    moduleName,
    recordId,
    siteId,
    uploadedBy,
    originalName: file.originalname,
    storagePath: file.path.replace(process.cwd(), '').replace(/\\/g, '/').replace(/^\/+/, ''),
    mimeType: file.mimetype,
    fileSize: file.size
  });

const listAttachments = async (moduleName, recordId) =>
  Attachment.findAll({
    where: { moduleName, recordId },
    order: [['createdAt', 'DESC']]
  });

module.exports = {
  createAttachment,
  listAttachments
};
