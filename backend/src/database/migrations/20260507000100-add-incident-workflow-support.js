'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('incidents', 'assigned_investigator_id', {
      type: Sequelize.UUID,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      },
      onUpdate: 'CASCADE'
    });

    await queryInterface.addColumn('incidents', 'investigation_priority', {
      type: Sequelize.ENUM('low', 'medium', 'high', 'critical'),
      allowNull: true
    });

    await queryInterface.addColumn('incidents', 'investigation_due_date', {
      type: Sequelize.DATEONLY,
      allowNull: true
    });

    await queryInterface.addColumn('incidents', 'management_review_comments', {
      type: Sequelize.TEXT,
      allowNull: true
    });

    await queryInterface.addColumn('incidents', 'management_reviewed_at', {
      type: Sequelize.DATE,
      allowNull: true
    });

    await queryInterface.addColumn('incidents', 'management_reviewed_by', {
      type: Sequelize.UUID,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      },
      onUpdate: 'CASCADE'
    });

    await queryInterface.createTable('incident_escalations', {
      id: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true
      },
      incident_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'incidents',
          key: 'id'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },
      escalation_type: {
        type: Sequelize.STRING(80),
        allowNull: false
      },
      escalation_level: {
        type: Sequelize.STRING(80),
        allowNull: false
      },
      reason: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      triggered_by: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'CASCADE'
      },
      triggered_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      resolved_at: {
        type: Sequelize.DATE,
        allowNull: true
      },
      metadata: {
        type: Sequelize.JSON,
        allowNull: true
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      deleted_at: {
        type: Sequelize.DATE,
        allowNull: true
      }
    });

    await queryInterface.addIndex('incidents', ['assigned_investigator_id']);
    await queryInterface.addIndex('incident_escalations', ['incident_id']);
    await queryInterface.addIndex('incident_escalations', ['escalation_type', 'escalation_level']);
  },

  async down(queryInterface) {
    await queryInterface.removeIndex('incident_escalations', ['escalation_type', 'escalation_level']);
    await queryInterface.removeIndex('incident_escalations', ['incident_id']);
    await queryInterface.removeIndex('incidents', ['assigned_investigator_id']);
    await queryInterface.dropTable('incident_escalations');
    await queryInterface.removeColumn('incidents', 'management_reviewed_by');
    await queryInterface.removeColumn('incidents', 'management_reviewed_at');
    await queryInterface.removeColumn('incidents', 'management_review_comments');
    await queryInterface.removeColumn('incidents', 'investigation_due_date');
    await queryInterface.removeColumn('incidents', 'investigation_priority');
    await queryInterface.removeColumn('incidents', 'assigned_investigator_id');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_incidents_investigation_priority";');
  }
};
