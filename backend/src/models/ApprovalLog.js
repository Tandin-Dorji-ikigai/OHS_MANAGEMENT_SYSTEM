const { DataTypes } = require('sequelize');
const { APPROVAL_ACTIONS } = require('../constants/workflow');

module.exports = (sequelize) =>
  sequelize.define(
    'ApprovalLog',
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
      action: {
        type: DataTypes.ENUM(...APPROVAL_ACTIONS),
        allowNull: false
      },
      fromStatus: {
        type: DataTypes.STRING(50),
        allowNull: true,
        field: 'from_status'
      },
      toStatus: {
        type: DataTypes.STRING(50),
        allowNull: false,
        field: 'to_status'
      },
      comments: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      actionBy: {
        type: DataTypes.UUID,
        allowNull: false,
        field: 'action_by'
      }
    },
    {
      tableName: 'approval_logs'
    }
  );
