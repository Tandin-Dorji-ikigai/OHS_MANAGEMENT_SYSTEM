const { DataTypes } = require('sequelize');
const { NOTIFICATION_TYPES } = require('../constants/workflow');

module.exports = (sequelize) =>
  sequelize.define(
    'Notification',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
        field: 'user_id'
      },
      title: {
        type: DataTypes.STRING(180),
        allowNull: false
      },
      message: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      type: {
        type: DataTypes.ENUM(...NOTIFICATION_TYPES),
        allowNull: false
      },
      moduleName: {
        type: DataTypes.STRING(100),
        allowNull: true,
        field: 'module_name'
      },
      recordId: {
        type: DataTypes.UUID,
        allowNull: true,
        field: 'record_id'
      },
      isRead: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        field: 'is_read'
      },
      readAt: {
        type: DataTypes.DATE,
        allowNull: true,
        field: 'read_at'
      }
    },
    {
      tableName: 'notifications'
    }
  );
