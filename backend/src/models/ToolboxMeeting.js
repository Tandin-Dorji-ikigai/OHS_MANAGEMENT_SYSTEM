const { DataTypes } = require('sequelize');
const { RECORD_STATUSES } = require('../constants/workflow');

module.exports = (sequelize) =>
  sequelize.define(
    'ToolboxMeeting',
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
      topic: {
        type: DataTypes.STRING(180),
        allowNull: false
      },
      facilitator: {
        type: DataTypes.STRING(180),
        allowNull: false
      },
      meetingDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        field: 'meeting_date'
      },
      attendees: {
        type: DataTypes.JSON,
        allowNull: true
      },
      notes: {
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
      tableName: 'toolbox_meetings'
    }
  );
