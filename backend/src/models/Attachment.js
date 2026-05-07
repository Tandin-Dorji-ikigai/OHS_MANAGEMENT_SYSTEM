const { DataTypes } = require('sequelize');

module.exports = (sequelize) =>
  sequelize.define(
    'Attachment',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },
      moduleName: {
        type: DataTypes.STRING(100),
        allowNull: false,
        field: 'module_name'
      },
      recordId: {
        type: DataTypes.UUID,
        allowNull: false,
        field: 'record_id'
      },
      siteId: {
        type: DataTypes.UUID,
        allowNull: true,
        field: 'site_id'
      },
      uploadedBy: {
        type: DataTypes.UUID,
        allowNull: false,
        field: 'uploaded_by'
      },
      originalName: {
        type: DataTypes.STRING(255),
        allowNull: false,
        field: 'original_name'
      },
      storagePath: {
        type: DataTypes.STRING(500),
        allowNull: false,
        field: 'storage_path'
      },
      mimeType: {
        type: DataTypes.STRING(100),
        allowNull: false,
        field: 'mime_type'
      },
      fileSize: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'file_size'
      }
    },
    {
      tableName: 'attachments'
    }
  );
