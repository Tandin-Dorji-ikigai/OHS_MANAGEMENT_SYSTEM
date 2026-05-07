const { DataTypes } = require('sequelize');
const { ACTION_STATUSES, PRIORITIES } = require('../constants/workflow');

module.exports = (sequelize) =>
  sequelize.define(
    'CorrectiveAction',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },
      title: {
        type: DataTypes.STRING(180),
        allowNull: false
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      sourceModule: {
        type: DataTypes.STRING(100),
        allowNull: false,
        field: 'source_module'
      },
      sourceRecordId: {
        type: DataTypes.UUID,
        allowNull: false,
        field: 'source_record_id'
      },
      siteId: {
        type: DataTypes.UUID,
        allowNull: false,
        field: 'site_id'
      },
      assignedTo: {
        type: DataTypes.UUID,
        allowNull: true,
        field: 'assigned_to'
      },
      priority: {
        type: DataTypes.ENUM(...PRIORITIES),
        allowNull: false,
        defaultValue: 'medium'
      },
      dueDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        field: 'due_date'
      },
      status: {
        type: DataTypes.ENUM(...ACTION_STATUSES),
        allowNull: false,
        defaultValue: 'open'
      },
      closureEvidence: {
        type: DataTypes.TEXT,
        allowNull: true,
        field: 'closure_evidence'
      },
      verificationComments: {
        type: DataTypes.TEXT,
        allowNull: true,
        field: 'verification_comments'
      },
      closedAt: {
        type: DataTypes.DATE,
        allowNull: true,
        field: 'closed_at'
      },
      verifiedBy: {
        type: DataTypes.UUID,
        allowNull: true,
        field: 'verified_by'
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
      tableName: 'corrective_actions'
    }
  );
