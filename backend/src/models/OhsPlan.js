const { DataTypes } = require('sequelize');
const { RECORD_STATUSES } = require('../constants/workflow');

module.exports = (sequelize) =>
  sequelize.define(
    'OhsPlan',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },
      siteId: {
        type: DataTypes.UUID,
        allowNull: true,
        field: 'site_id'
      },
      title: {
        type: DataTypes.STRING(180),
        allowNull: false
      },
      year: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      objective: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      targetMetric: {
        type: DataTypes.STRING(180),
        allowNull: true,
        field: 'target_metric'
      },
      ownerName: {
        type: DataTypes.STRING(180),
        allowNull: true,
        field: 'owner_name'
      },
      dueDate: {
        type: DataTypes.DATEONLY,
        allowNull: true,
        field: 'due_date'
      },
      progressPercent: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false,
        defaultValue: 0,
        field: 'progress_percent'
      },
      status: {
        type: DataTypes.ENUM(...RECORD_STATUSES),
        allowNull: false,
        defaultValue: 'draft'
      },
      createdBy: {
        type: DataTypes.UUID,
        allowNull: false,
        field: 'created_by'
      },
      updatedBy: {
        type: DataTypes.UUID,
        allowNull: true,
        field: 'updated_by'
      }
    },
    {
      tableName: 'ohs_plans'
    }
  );
