const { DataTypes } = require('sequelize');

module.exports = (sequelize) =>
  sequelize.define(
    'UserSite',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
        field: 'user_id'
      },
      siteId: {
        type: DataTypes.UUID,
        allowNull: false,
        field: 'site_id'
      },
      isPrimary: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        field: 'is_primary'
      }
    },
    {
      tableName: 'user_sites'
    }
  );
