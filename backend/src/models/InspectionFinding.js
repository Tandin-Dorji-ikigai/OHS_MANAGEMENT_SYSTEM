const { DataTypes } = require('sequelize');
const { PRIORITIES } = require('../constants/workflow');

module.exports = (sequelize) =>
  sequelize.define(
    'InspectionFinding',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },
      inspectionId: {
        type: DataTypes.UUID,
        allowNull: false,
        field: 'inspection_id'
      },
      title: {
        type: DataTypes.STRING(180),
        allowNull: false
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      recommendation: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      priority: {
        type: DataTypes.ENUM(...PRIORITIES),
        allowNull: false,
        defaultValue: 'medium'
      },
      actionRequired: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
        field: 'action_required'
      }
    },
    {
      tableName: 'inspection_findings'
    }
  );
