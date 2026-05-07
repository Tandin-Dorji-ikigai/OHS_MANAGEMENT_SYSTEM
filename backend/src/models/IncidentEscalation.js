const { DataTypes } = require('sequelize');

module.exports = (sequelize) =>
  sequelize.define(
    'IncidentEscalation',
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
      escalationType: {
        type: DataTypes.STRING(80),
        allowNull: false,
        field: 'escalation_type'
      },
      escalationLevel: {
        type: DataTypes.STRING(80),
        allowNull: false,
        field: 'escalation_level'
      },
      reason: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      triggeredBy: {
        type: DataTypes.UUID,
        allowNull: true,
        field: 'triggered_by'
      },
      triggeredAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        field: 'triggered_at'
      },
      resolvedAt: {
        type: DataTypes.DATE,
        allowNull: true,
        field: 'resolved_at'
      },
      metadata: {
        type: DataTypes.JSON,
        allowNull: true
      }
    },
    {
      tableName: 'incident_escalations'
    }
  );
