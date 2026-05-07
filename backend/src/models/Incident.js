const { DataTypes } = require('sequelize');
const { RECORD_STATUSES } = require('../constants/workflow');

module.exports = (sequelize) =>
  sequelize.define(
    'Incident',
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
      incidentType: {
        type: DataTypes.ENUM('accident', 'near_miss', 'unsafe_condition', 'unsafe_act'),
        allowNull: false,
        field: 'incident_type'
      },
      severity: {
        type: DataTypes.ENUM('minor', 'moderate', 'major', 'critical'),
        allowNull: false
      },
      eventDate: {
        type: DataTypes.DATE,
        allowNull: false,
        field: 'event_date'
      },
      location: {
        type: DataTypes.STRING(180),
        allowNull: false
      },
      peopleInvolved: {
        type: DataTypes.JSON,
        allowNull: true,
        field: 'people_involved'
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      immediateActions: {
        type: DataTypes.TEXT,
        allowNull: true,
        field: 'immediate_actions'
      },
      rootCause: {
        type: DataTypes.TEXT,
        allowNull: true,
        field: 'root_cause'
      },
      assignedInvestigatorId: {
        type: DataTypes.UUID,
        allowNull: true,
        field: 'assigned_investigator_id'
      },
      investigationPriority: {
        type: DataTypes.ENUM('low', 'medium', 'high', 'critical'),
        allowNull: true,
        field: 'investigation_priority'
      },
      investigationDueDate: {
        type: DataTypes.DATEONLY,
        allowNull: true,
        field: 'investigation_due_date'
      },
      managementReviewComments: {
        type: DataTypes.TEXT,
        allowNull: true,
        field: 'management_review_comments'
      },
      managementReviewedAt: {
        type: DataTypes.DATE,
        allowNull: true,
        field: 'management_reviewed_at'
      },
      managementReviewedBy: {
        type: DataTypes.UUID,
        allowNull: true,
        field: 'management_reviewed_by'
      },
      status: {
        type: DataTypes.ENUM(...RECORD_STATUSES),
        allowNull: false,
        defaultValue: 'draft'
      },
      urgentFlag: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        field: 'urgent_flag'
      },
      submittedAt: {
        type: DataTypes.DATE,
        allowNull: true,
        field: 'submitted_at'
      },
      validatedAt: {
        type: DataTypes.DATE,
        allowNull: true,
        field: 'validated_at'
      },
      approvedAt: {
        type: DataTypes.DATE,
        allowNull: true,
        field: 'approved_at'
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
      },
      approvedBy: {
        type: DataTypes.UUID,
        allowNull: true,
        field: 'approved_by'
      }
    },
    {
      tableName: 'incidents'
    }
  );
