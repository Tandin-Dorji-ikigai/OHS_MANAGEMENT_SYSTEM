const { DataTypes } = require('sequelize');
const { PRIORITIES } = require('../constants/workflow');

module.exports = (sequelize) =>
  sequelize.define(
    'RiskItem',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },
      riskAssessmentId: {
        type: DataTypes.UUID,
        allowNull: false,
        field: 'risk_assessment_id'
      },
      hazard: {
        type: DataTypes.STRING(255),
        allowNull: false
      },
      consequence: {
        type: DataTypes.STRING(255),
        allowNull: true
      },
      likelihood: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      severity: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      riskScore: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'risk_score'
      },
      riskLevel: {
        type: DataTypes.ENUM(...PRIORITIES),
        allowNull: false,
        field: 'risk_level'
      },
      controlMeasures: {
        type: DataTypes.TEXT,
        allowNull: false,
        field: 'control_measures'
      },
      responsiblePerson: {
        type: DataTypes.STRING(180),
        allowNull: true,
        field: 'responsible_person'
      }
    },
    {
      tableName: 'risk_items'
    }
  );
