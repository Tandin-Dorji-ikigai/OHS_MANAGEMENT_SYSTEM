const { DataTypes } = require('sequelize');
const { RECORD_STATUSES } = require('../constants/workflow');

module.exports = (sequelize) =>
  sequelize.define(
    'Inspection',
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
      siteId: {
        type: DataTypes.UUID,
        allowNull: false,
        field: 'site_id'
      },
      scheduleDate: {
        type: DataTypes.DATEONLY,
        allowNull: true,
        field: 'schedule_date'
      },
      inspectionDate: {
        type: DataTypes.DATEONLY,
        allowNull: true,
        field: 'inspection_date'
      },
      templateName: {
        type: DataTypes.STRING(120),
        allowNull: true,
        field: 'template_name'
      },
      status: {
        type: DataTypes.ENUM(...RECORD_STATUSES),
        allowNull: false,
        defaultValue: 'draft'
      },
      observations: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      recommendations: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      complianceScore: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false,
        defaultValue: 0,
        field: 'compliance_score'
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
      tableName: 'inspections'
    }
  );
