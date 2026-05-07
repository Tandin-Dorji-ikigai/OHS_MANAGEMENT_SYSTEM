const { DataTypes } = require('sequelize');
const { RECORD_STATUSES } = require('../constants/workflow');

module.exports = (sequelize) =>
  sequelize.define(
    'RiskAssessment',
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
      jobTask: {
        type: DataTypes.STRING(180),
        allowNull: false,
        field: 'job_task'
      },
      version: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1
      },
      status: {
        type: DataTypes.ENUM(...RECORD_STATUSES),
        allowNull: false,
        defaultValue: 'draft'
      },
      assessmentDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        field: 'assessment_date'
      },
      nextReviewDate: {
        type: DataTypes.DATEONLY,
        allowNull: true,
        field: 'next_review_date'
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
      tableName: 'risk_assessments'
    }
  );
