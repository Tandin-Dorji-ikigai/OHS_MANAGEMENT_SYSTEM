const { DataTypes } = require('sequelize');

module.exports = (sequelize) =>
  sequelize.define(
    'User',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },
      roleId: {
        type: DataTypes.UUID,
        allowNull: false,
        field: 'role_id'
      },
      firstName: {
        type: DataTypes.STRING(100),
        allowNull: false,
        field: 'first_name'
      },
      lastName: {
        type: DataTypes.STRING(100),
        allowNull: false,
        field: 'last_name'
      },
      email: {
        type: DataTypes.STRING(150),
        allowNull: false,
        unique: true
      },
      phoneNumber: {
        type: DataTypes.STRING(30),
        allowNull: true,
        field: 'phone_number'
      },
      employeeCode: {
        type: DataTypes.STRING(50),
        allowNull: true,
        unique: true,
        field: 'employee_code'
      },
      passwordHash: {
        type: DataTypes.STRING(255),
        allowNull: false,
        field: 'password_hash'
      },
      department: {
        type: DataTypes.STRING(100),
        allowNull: true
      },
      teamName: {
        type: DataTypes.STRING(100),
        allowNull: true,
        field: 'team_name'
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
        field: 'is_active'
      },
      lastLoginAt: {
        type: DataTypes.DATE,
        allowNull: true,
        field: 'last_login_at'
      }
    },
    {
      tableName: 'users'
    }
  );
