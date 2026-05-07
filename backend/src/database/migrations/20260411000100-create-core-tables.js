'use strict';

const uuidPk = {
  type: require('sequelize').UUID,
  allowNull: false,
  primaryKey: true
};

const timestamps = {
  created_at: { type: require('sequelize').DATE, allowNull: false, defaultValue: require('sequelize').literal('CURRENT_TIMESTAMP') },
  updated_at: { type: require('sequelize').DATE, allowNull: false, defaultValue: require('sequelize').literal('CURRENT_TIMESTAMP') },
  deleted_at: { type: require('sequelize').DATE, allowNull: true }
};

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('roles', {
      id: uuidPk,
      name: { type: Sequelize.STRING(100), allowNull: false, unique: true },
      description: { type: Sequelize.STRING(255), allowNull: true },
      ...timestamps
    });

    await queryInterface.createTable('sites', {
      id: uuidPk,
      code: { type: Sequelize.STRING(50), allowNull: false, unique: true },
      name: { type: Sequelize.STRING(150), allowNull: false },
      region: { type: Sequelize.STRING(100), allowNull: true },
      country: { type: Sequelize.STRING(100), allowNull: true },
      address: { type: Sequelize.TEXT, allowNull: true },
      latitude: { type: Sequelize.DECIMAL(10, 7), allowNull: true },
      longitude: { type: Sequelize.DECIMAL(10, 7), allowNull: true },
      site_type: { type: Sequelize.STRING(100), allowNull: true },
      is_active: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: true },
      ...timestamps
    });

    await queryInterface.createTable('users', {
      id: uuidPk,
      role_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: 'roles', key: 'id' },
        onUpdate: 'CASCADE'
      },
      first_name: { type: Sequelize.STRING(100), allowNull: false },
      last_name: { type: Sequelize.STRING(100), allowNull: false },
      email: { type: Sequelize.STRING(150), allowNull: false, unique: true },
      phone_number: { type: Sequelize.STRING(30), allowNull: true },
      employee_code: { type: Sequelize.STRING(50), allowNull: true, unique: true },
      password_hash: { type: Sequelize.STRING(255), allowNull: false },
      department: { type: Sequelize.STRING(100), allowNull: true },
      team_name: { type: Sequelize.STRING(100), allowNull: true },
      is_active: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: true },
      last_login_at: { type: Sequelize.DATE, allowNull: true },
      ...timestamps
    });

    await queryInterface.createTable('user_sites', {
      id: uuidPk,
      user_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: 'users', key: 'id' },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },
      site_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: 'sites', key: 'id' },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },
      is_primary: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false },
      ...timestamps
    });

    await queryInterface.createTable('refresh_tokens', {
      id: uuidPk,
      user_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: 'users', key: 'id' },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },
      token: { type: Sequelize.TEXT, allowNull: false },
      expires_at: { type: Sequelize.DATE, allowNull: false },
      is_revoked: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false },
      ...timestamps
    });

    await queryInterface.createTable('notifications', {
      id: uuidPk,
      user_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: 'users', key: 'id' },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },
      title: { type: Sequelize.STRING(180), allowNull: false },
      message: { type: Sequelize.TEXT, allowNull: false },
      type: {
        type: Sequelize.ENUM(
          'submission_created',
          'returned_for_correction',
          'approval_completed',
          'rejection_completed',
          'high_severity_incident',
          'overdue_action',
          'schedule_reminder'
        ),
        allowNull: false
      },
      module_name: { type: Sequelize.STRING(100), allowNull: true },
      record_id: { type: Sequelize.UUID, allowNull: true },
      is_read: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false },
      read_at: { type: Sequelize.DATE, allowNull: true },
      ...timestamps
    });

    await queryInterface.createTable('approval_logs', {
      id: uuidPk,
      module_name: { type: Sequelize.STRING(100), allowNull: false },
      record_id: { type: Sequelize.UUID, allowNull: false },
      action: { type: Sequelize.ENUM('submit', 'review', 'return', 'validate', 'approve', 'reject', 'close'), allowNull: false },
      from_status: { type: Sequelize.STRING(50), allowNull: true },
      to_status: { type: Sequelize.STRING(50), allowNull: false },
      comments: { type: Sequelize.TEXT, allowNull: true },
      action_by: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: 'users', key: 'id' },
        onUpdate: 'CASCADE'
      },
      ...timestamps
    });

    await queryInterface.createTable('audit_logs', {
      id: uuidPk,
      module_name: { type: Sequelize.STRING(100), allowNull: false },
      record_id: { type: Sequelize.UUID, allowNull: false },
      action: { type: Sequelize.STRING(100), allowNull: false },
      comments: { type: Sequelize.TEXT, allowNull: true },
      metadata: { type: Sequelize.JSON, allowNull: true },
      action_by: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: 'users', key: 'id' },
        onUpdate: 'CASCADE'
      },
      ...timestamps
    });

    await queryInterface.createTable('attachments', {
      id: uuidPk,
      module_name: { type: Sequelize.STRING(100), allowNull: false },
      record_id: { type: Sequelize.UUID, allowNull: false },
      site_id: {
        type: Sequelize.UUID,
        allowNull: true,
        references: { model: 'sites', key: 'id' },
        onUpdate: 'CASCADE'
      },
      uploaded_by: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: 'users', key: 'id' },
        onUpdate: 'CASCADE'
      },
      original_name: { type: Sequelize.STRING(255), allowNull: false },
      storage_path: { type: Sequelize.STRING(500), allowNull: false },
      mime_type: { type: Sequelize.STRING(100), allowNull: false },
      file_size: { type: Sequelize.INTEGER, allowNull: false },
      ...timestamps
    });

    await queryInterface.addIndex('users', ['role_id']);
    await queryInterface.addIndex('user_sites', ['user_id', 'site_id'], { unique: true });
    await queryInterface.addIndex('notifications', ['user_id', 'is_read']);
    await queryInterface.addIndex('approval_logs', ['module_name', 'record_id']);
    await queryInterface.addIndex('audit_logs', ['module_name', 'record_id']);
    await queryInterface.addIndex('attachments', ['module_name', 'record_id']);
  },

  async down(queryInterface) {
    await queryInterface.dropTable('attachments');
    await queryInterface.dropTable('audit_logs');
    await queryInterface.dropTable('approval_logs');
    await queryInterface.dropTable('notifications');
    await queryInterface.dropTable('refresh_tokens');
    await queryInterface.dropTable('user_sites');
    await queryInterface.dropTable('users');
    await queryInterface.dropTable('sites');
    await queryInterface.dropTable('roles');
  }
};
