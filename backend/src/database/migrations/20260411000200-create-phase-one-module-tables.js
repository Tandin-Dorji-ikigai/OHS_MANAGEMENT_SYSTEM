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
    await queryInterface.createTable('inspections', {
      id: uuidPk,
      title: { type: Sequelize.STRING(180), allowNull: false },
      site_id: { type: Sequelize.UUID, allowNull: false, references: { model: 'sites', key: 'id' }, onUpdate: 'CASCADE' },
      schedule_date: { type: Sequelize.DATEONLY, allowNull: true },
      inspection_date: { type: Sequelize.DATEONLY, allowNull: true },
      template_name: { type: Sequelize.STRING(120), allowNull: true },
      status: { type: Sequelize.ENUM('draft', 'submitted', 'under_review', 'returned_for_correction', 'validated', 'approved', 'rejected', 'closed'), allowNull: false, defaultValue: 'draft' },
      observations: { type: Sequelize.TEXT, allowNull: true },
      recommendations: { type: Sequelize.TEXT, allowNull: true },
      compliance_score: { type: Sequelize.DECIMAL(5, 2), allowNull: false, defaultValue: 0 },
      submitted_at: { type: Sequelize.DATE, allowNull: true },
      validated_at: { type: Sequelize.DATE, allowNull: true },
      approved_at: { type: Sequelize.DATE, allowNull: true },
      created_by: { type: Sequelize.UUID, allowNull: false, references: { model: 'users', key: 'id' }, onUpdate: 'CASCADE' },
      updated_by: { type: Sequelize.UUID, allowNull: true },
      approved_by: { type: Sequelize.UUID, allowNull: true },
      ...timestamps
    });

    await queryInterface.createTable('inspection_items', {
      id: uuidPk,
      inspection_id: { type: Sequelize.UUID, allowNull: false, references: { model: 'inspections', key: 'id' }, onDelete: 'CASCADE', onUpdate: 'CASCADE' },
      checklist_text: { type: Sequelize.STRING(255), allowNull: false },
      is_compliant: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false },
      comments: { type: Sequelize.TEXT, allowNull: true },
      sort_order: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
      ...timestamps
    });

    await queryInterface.createTable('inspection_findings', {
      id: uuidPk,
      inspection_id: { type: Sequelize.UUID, allowNull: false, references: { model: 'inspections', key: 'id' }, onDelete: 'CASCADE', onUpdate: 'CASCADE' },
      title: { type: Sequelize.STRING(180), allowNull: false },
      description: { type: Sequelize.TEXT, allowNull: false },
      recommendation: { type: Sequelize.TEXT, allowNull: true },
      priority: { type: Sequelize.ENUM('low', 'medium', 'high', 'critical'), allowNull: false, defaultValue: 'medium' },
      action_required: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: true },
      ...timestamps
    });

    await queryInterface.createTable('incidents', {
      id: uuidPk,
      site_id: { type: Sequelize.UUID, allowNull: false, references: { model: 'sites', key: 'id' }, onUpdate: 'CASCADE' },
      incident_type: { type: Sequelize.ENUM('accident', 'near_miss', 'unsafe_condition', 'unsafe_act'), allowNull: false },
      severity: { type: Sequelize.ENUM('minor', 'moderate', 'major', 'critical'), allowNull: false },
      event_date: { type: Sequelize.DATE, allowNull: false },
      location: { type: Sequelize.STRING(180), allowNull: false },
      people_involved: { type: Sequelize.JSON, allowNull: true },
      description: { type: Sequelize.TEXT, allowNull: false },
      immediate_actions: { type: Sequelize.TEXT, allowNull: true },
      root_cause: { type: Sequelize.TEXT, allowNull: true },
      status: { type: Sequelize.ENUM('draft', 'submitted', 'under_review', 'returned_for_correction', 'validated', 'approved', 'rejected', 'closed'), allowNull: false, defaultValue: 'draft' },
      urgent_flag: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false },
      submitted_at: { type: Sequelize.DATE, allowNull: true },
      validated_at: { type: Sequelize.DATE, allowNull: true },
      approved_at: { type: Sequelize.DATE, allowNull: true },
      created_by: { type: Sequelize.UUID, allowNull: false, references: { model: 'users', key: 'id' }, onUpdate: 'CASCADE' },
      updated_by: { type: Sequelize.UUID, allowNull: true },
      approved_by: { type: Sequelize.UUID, allowNull: true },
      ...timestamps
    });

    await queryInterface.createTable('incident_investigations', {
      id: uuidPk,
      incident_id: { type: Sequelize.UUID, allowNull: false, references: { model: 'incidents', key: 'id' }, onDelete: 'CASCADE', onUpdate: 'CASCADE' },
      investigator_id: { type: Sequelize.UUID, allowNull: false, references: { model: 'users', key: 'id' }, onUpdate: 'CASCADE' },
      investigation_date: { type: Sequelize.DATEONLY, allowNull: false },
      findings: { type: Sequelize.TEXT, allowNull: false },
      root_cause_analysis: { type: Sequelize.TEXT, allowNull: true },
      recommendations: { type: Sequelize.TEXT, allowNull: true },
      ...timestamps
    });

    await queryInterface.addIndex('inspections', ['site_id', 'status']);
    await queryInterface.addIndex('inspection_items', ['inspection_id']);
    await queryInterface.addIndex('inspection_findings', ['inspection_id']);
    await queryInterface.addIndex('incidents', ['site_id', 'status']);
    await queryInterface.addIndex('incidents', ['severity', 'urgent_flag']);
    await queryInterface.addIndex('incident_investigations', ['incident_id']);
  },

  async down(queryInterface) {
    await queryInterface.dropTable('incident_investigations');
    await queryInterface.dropTable('incidents');
    await queryInterface.dropTable('inspection_findings');
    await queryInterface.dropTable('inspection_items');
    await queryInterface.dropTable('inspections');
  }
};
