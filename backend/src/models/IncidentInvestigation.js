const { DataTypes } = require('sequelize');

module.exports = (sequelize) =>
  sequelize.define(
    'IncidentInvestigation',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },
      incidentId: {
        type: DataTypes.UUID,
        allowNull: false,
        field: 'incident_id'
      },
      investigatorId: {
        type: DataTypes.UUID,
        allowNull: false,
        field: 'investigator_id'
      },
      investigationDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        field: 'investigation_date'
      },
      findings: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      rootCauseAnalysis: {
        type: DataTypes.TEXT,
        allowNull: true,
        field: 'root_cause_analysis'
      },
      recommendations: {
        type: DataTypes.TEXT,
        allowNull: true
      }
    },
    {
      tableName: 'incident_investigations'
    }
  );
