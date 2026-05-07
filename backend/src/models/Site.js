const { DataTypes } = require('sequelize');

module.exports = (sequelize) =>
  sequelize.define(
    'Site',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },
      code: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true
      },
      name: {
        type: DataTypes.STRING(150),
        allowNull: false
      },
      region: {
        type: DataTypes.STRING(100),
        allowNull: true
      },
      country: {
        type: DataTypes.STRING(100),
        allowNull: true
      },
      address: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      latitude: {
        type: DataTypes.DECIMAL(10, 7),
        allowNull: true
      },
      longitude: {
        type: DataTypes.DECIMAL(10, 7),
        allowNull: true
      },
      siteType: {
        type: DataTypes.STRING(100),
        allowNull: true,
        field: 'site_type'
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
        field: 'is_active'
      }
    },
    {
      tableName: 'sites'
    }
  );
