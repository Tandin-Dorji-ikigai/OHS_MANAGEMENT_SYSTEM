const { DataTypes } = require('sequelize');
const { RECORD_STATUSES } = require('../constants/workflow');

module.exports = (sequelize) =>
  sequelize.define(
    'OhsActivity',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },
      siteId: {
        type: DataTypes.UUID,
        allowNull: false,
        field: 'site_id'
      },
      activityType: {
        type: DataTypes.ENUM('daily_log', 'weekly_log', 'awareness_session', 'committee_meeting'),
        allowNull: false,
        field: 'activity_type'
      },
      title: {
        type: DataTypes.STRING(180),
        allowNull: false
      },
      activityDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        field: 'activity_date'
      },
      summary: {
        type: DataTypes.TEXT,
        allowNull: true
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
      tableName: 'ohs_activities'
    }
  );
