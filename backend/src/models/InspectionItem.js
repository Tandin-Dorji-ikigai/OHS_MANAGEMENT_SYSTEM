const { DataTypes } = require('sequelize');

module.exports = (sequelize) =>
  sequelize.define(
    'InspectionItem',
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
      checklistText: {
        type: DataTypes.STRING(255),
        allowNull: false,
        field: 'checklist_text'
      },
      isCompliant: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        field: 'is_compliant'
      },
      comments: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      sortOrder: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        field: 'sort_order'
      }
    },
    {
      tableName: 'inspection_items'
    }
  );
