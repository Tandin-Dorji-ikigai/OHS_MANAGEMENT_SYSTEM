const { DataTypes } = require('sequelize');
const { RECORD_STATUSES } = require('../constants/workflow');

module.exports = (sequelize) =>
  sequelize.define(
    'Training',
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
      title: {
        type: DataTypes.STRING(180),
        allowNull: false
      },
      topic: {
        type: DataTypes.STRING(180),
        allowNull: false
      },
      trainerName: {
        type: DataTypes.STRING(180),
        allowNull: false,
        field: 'trainer_name'
      },
      trainingDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        field: 'training_date'
      },
      attendeeCount: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        field: 'attendee_count'
      },
      attendees: {
        type: DataTypes.JSON,
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
      tableName: 'trainings'
    }
  );
