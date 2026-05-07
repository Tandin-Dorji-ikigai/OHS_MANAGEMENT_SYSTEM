const { DataTypes } = require('sequelize');

module.exports = (sequelize) =>
  sequelize.define(
    'AuditLog',
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
        type: DataTypes.STRING(100),
        allowNull: false
      },
      comments: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      metadata: {
        type: DataTypes.JSON,
        allowNull: true
      },
      actionBy: {
        type: DataTypes.UUID,
        allowNull: false,
        field: 'action_by'
      }
    },
    {
      tableName: 'audit_logs'
    }
  );
