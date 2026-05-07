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
    await queryInterface.createTable('risk_assessments', {
      id: uuidPk,
      site_id: { type: Sequelize.UUID, allowNull: false, references: { model: 'sites', key: 'id' }, onUpdate: 'CASCADE' },
      title: { type: Sequelize.STRING(180), allowNull: false },
      job_task: { type: Sequelize.STRING(180), allowNull: false },
      version: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 1 },
      status: { type: Sequelize.ENUM('draft', 'submitted', 'under_review', 'returned_for_correction', 'validated', 'approved', 'rejected', 'closed'), allowNull: false, defaultValue: 'draft' },
      assessment_date: { type: Sequelize.DATEONLY, allowNull: false },
      next_review_date: { type: Sequelize.DATEONLY, allowNull: true },
      created_by: { type: Sequelize.UUID, allowNull: false, references: { model: 'users', key: 'id' }, onUpdate: 'CASCADE' },
      updated_by: { type: Sequelize.UUID, allowNull: true },
      approved_by: { type: Sequelize.UUID, allowNull: true },
      ...timestamps
    });

    await queryInterface.createTable('risk_items', {
      id: uuidPk,
      risk_assessment_id: { type: Sequelize.UUID, allowNull: false, references: { model: 'risk_assessments', key: 'id' }, onDelete: 'CASCADE', onUpdate: 'CASCADE' },
      hazard: { type: Sequelize.STRING(255), allowNull: false },
      consequence: { type: Sequelize.STRING(255), allowNull: true },
      likelihood: { type: Sequelize.INTEGER, allowNull: false },
      severity: { type: Sequelize.INTEGER, allowNull: false },
      risk_score: { type: Sequelize.INTEGER, allowNull: false },
      risk_level: { type: Sequelize.ENUM('low', 'medium', 'high', 'critical'), allowNull: false },
      control_measures: { type: Sequelize.TEXT, allowNull: false },
      responsible_person: { type: Sequelize.STRING(180), allowNull: true },
      ...timestamps
    });

    await queryInterface.createTable('trainings', {
      id: uuidPk,
      site_id: { type: Sequelize.UUID, allowNull: false, references: { model: 'sites', key: 'id' }, onUpdate: 'CASCADE' },
      title: { type: Sequelize.STRING(180), allowNull: false },
      topic: { type: Sequelize.STRING(180), allowNull: false },
      trainer_name: { type: Sequelize.STRING(180), allowNull: false },
      training_date: { type: Sequelize.DATEONLY, allowNull: false },
      attendee_count: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
      attendees: { type: Sequelize.JSON, allowNull: true },
      status: { type: Sequelize.ENUM('draft', 'submitted', 'under_review', 'returned_for_correction', 'validated', 'approved', 'rejected', 'closed'), allowNull: false, defaultValue: 'draft' },
      created_by: { type: Sequelize.UUID, allowNull: false, references: { model: 'users', key: 'id' }, onUpdate: 'CASCADE' },
      updated_by: { type: Sequelize.UUID, allowNull: true },
      ...timestamps
    });

    await queryInterface.createTable('toolbox_meetings', {
      id: uuidPk,
      site_id: { type: Sequelize.UUID, allowNull: false, references: { model: 'sites', key: 'id' }, onUpdate: 'CASCADE' },
      topic: { type: Sequelize.STRING(180), allowNull: false },
      facilitator: { type: Sequelize.STRING(180), allowNull: false },
      meeting_date: { type: Sequelize.DATEONLY, allowNull: false },
      attendees: { type: Sequelize.JSON, allowNull: true },
      notes: { type: Sequelize.TEXT, allowNull: true },
      status: { type: Sequelize.ENUM('draft', 'submitted', 'under_review', 'returned_for_correction', 'validated', 'approved', 'rejected', 'closed'), allowNull: false, defaultValue: 'draft' },
      created_by: { type: Sequelize.UUID, allowNull: false, references: { model: 'users', key: 'id' }, onUpdate: 'CASCADE' },
      updated_by: { type: Sequelize.UUID, allowNull: true },
      ...timestamps
    });

    await queryInterface.createTable('ohs_activities', {
      id: uuidPk,
      site_id: { type: Sequelize.UUID, allowNull: false, references: { model: 'sites', key: 'id' }, onUpdate: 'CASCADE' },
      activity_type: { type: Sequelize.ENUM('daily_log', 'weekly_log', 'awareness_session', 'committee_meeting'), allowNull: false },
      title: { type: Sequelize.STRING(180), allowNull: false },
      activity_date: { type: Sequelize.DATEONLY, allowNull: false },
      summary: { type: Sequelize.TEXT, allowNull: true },
      status: { type: Sequelize.ENUM('draft', 'submitted', 'under_review', 'returned_for_correction', 'validated', 'approved', 'rejected', 'closed'), allowNull: false, defaultValue: 'draft' },
      created_by: { type: Sequelize.UUID, allowNull: false, references: { model: 'users', key: 'id' }, onUpdate: 'CASCADE' },
      updated_by: { type: Sequelize.UUID, allowNull: true },
      ...timestamps
    });

    await queryInterface.createTable('ohs_plans', {
      id: uuidPk,
      site_id: { type: Sequelize.UUID, allowNull: true, references: { model: 'sites', key: 'id' }, onUpdate: 'CASCADE' },
      title: { type: Sequelize.STRING(180), allowNull: false },
      year: { type: Sequelize.INTEGER, allowNull: false },
      objective: { type: Sequelize.TEXT, allowNull: false },
      target_metric: { type: Sequelize.STRING(180), allowNull: true },
      owner_name: { type: Sequelize.STRING(180), allowNull: true },
      due_date: { type: Sequelize.DATEONLY, allowNull: true },
      progress_percent: { type: Sequelize.DECIMAL(5, 2), allowNull: false, defaultValue: 0 },
      status: { type: Sequelize.ENUM('draft', 'submitted', 'under_review', 'returned_for_correction', 'validated', 'approved', 'rejected', 'closed'), allowNull: false, defaultValue: 'draft' },
      created_by: { type: Sequelize.UUID, allowNull: false, references: { model: 'users', key: 'id' }, onUpdate: 'CASCADE' },
      updated_by: { type: Sequelize.UUID, allowNull: true },
      ...timestamps
    });

    await queryInterface.createTable('corrective_actions', {
      id: uuidPk,
      title: { type: Sequelize.STRING(180), allowNull: false },
      description: { type: Sequelize.TEXT, allowNull: false },
      source_module: { type: Sequelize.STRING(100), allowNull: false },
      source_record_id: { type: Sequelize.UUID, allowNull: false },
      site_id: { type: Sequelize.UUID, allowNull: false, references: { model: 'sites', key: 'id' }, onUpdate: 'CASCADE' },
      assigned_to: { type: Sequelize.UUID, allowNull: true, references: { model: 'users', key: 'id' }, onUpdate: 'CASCADE' },
      priority: { type: Sequelize.ENUM('low', 'medium', 'high', 'critical'), allowNull: false, defaultValue: 'medium' },
      due_date: { type: Sequelize.DATEONLY, allowNull: false },
      status: { type: Sequelize.ENUM('open', 'in_progress', 'pending_verification', 'closed', 'overdue'), allowNull: false, defaultValue: 'open' },
      closure_evidence: { type: Sequelize.TEXT, allowNull: true },
      verification_comments: { type: Sequelize.TEXT, allowNull: true },
      closed_at: { type: Sequelize.DATE, allowNull: true },
      verified_by: { type: Sequelize.UUID, allowNull: true, references: { model: 'users', key: 'id' }, onUpdate: 'CASCADE' },
      created_by: { type: Sequelize.UUID, allowNull: false, references: { model: 'users', key: 'id' }, onUpdate: 'CASCADE' },
      updated_by: { type: Sequelize.UUID, allowNull: true },
      ...timestamps
    });

    await queryInterface.addIndex('risk_assessments', ['site_id', 'status']);
    await queryInterface.addIndex('risk_items', ['risk_assessment_id']);
    await queryInterface.addIndex('trainings', ['site_id', 'training_date']);
    await queryInterface.addIndex('toolbox_meetings', ['site_id', 'meeting_date']);
    await queryInterface.addIndex('ohs_activities', ['site_id', 'activity_date']);
    await queryInterface.addIndex('ohs_plans', ['year', 'status']);
    await queryInterface.addIndex('corrective_actions', ['site_id', 'status']);
    await queryInterface.addIndex('corrective_actions', ['assigned_to', 'due_date']);
  },

  async down(queryInterface) {
    await queryInterface.dropTable('corrective_actions');
    await queryInterface.dropTable('ohs_plans');
    await queryInterface.dropTable('ohs_activities');
    await queryInterface.dropTable('toolbox_meetings');
    await queryInterface.dropTable('trainings');
    await queryInterface.dropTable('risk_items');
    await queryInterface.dropTable('risk_assessments');
  }
};
