'use strict';

module.exports = {
  async up(queryInterface) {
    const now = new Date();

    await queryInterface.bulkInsert('inspections', [
      {
        id: 'ddddddd1-dddd-dddd-dddd-ddddddddddd1',
        title: 'Weekly PPE Compliance Inspection',
        site_id: 'aaaaaaa2-aaaa-aaaa-aaaa-aaaaaaaaaaa2',
        schedule_date: '2026-04-08',
        inspection_date: '2026-04-09',
        template_name: 'General Plant Safety',
        status: 'approved',
        observations: 'Most production lines were compliant.',
        recommendations: 'Improve storage discipline in the raw materials bay.',
        compliance_score: 84.62,
        submitted_at: now,
        validated_at: now,
        approved_at: now,
        created_by: 'bbbbbbb3-bbbb-bbbb-bbbb-bbbbbbbbbbb3',
        approved_by: 'bbbbbbb1-bbbb-bbbb-bbbb-bbbbbbbbbbb1',
        created_at: now,
        updated_at: now
      }
    ]);

    await queryInterface.bulkInsert('inspection_items', [
      {
        id: 'eeeeeee1-eeee-eeee-eeee-eeeeeeeeeee1',
        inspection_id: 'ddddddd1-dddd-dddd-dddd-ddddddddddd1',
        checklist_text: 'All personnel wearing required PPE',
        is_compliant: true,
        comments: 'Observed full compliance on line 1 and 2',
        sort_order: 1,
        created_at: now,
        updated_at: now
      },
      {
        id: 'eeeeeee2-eeee-eeee-eeee-eeeeeeeeeee2',
        inspection_id: 'ddddddd1-dddd-dddd-dddd-ddddddddddd1',
        checklist_text: 'Chemical storage labels visible and current',
        is_compliant: false,
        comments: 'Two containers missing updated labels',
        sort_order: 2,
        created_at: now,
        updated_at: now
      }
    ]);

    await queryInterface.bulkInsert('inspection_findings', [
      {
        id: 'fffffff1-ffff-ffff-ffff-fffffffffff1',
        inspection_id: 'ddddddd1-dddd-dddd-dddd-ddddddddddd1',
        title: 'Chemical label non-conformance',
        description: 'Intermediate storage drums lacked revision 2026 labels.',
        recommendation: 'Replace labels and add label verification to shift start checks.',
        priority: 'high',
        action_required: true,
        created_at: now,
        updated_at: now
      }
    ]);

    await queryInterface.bulkInsert('incidents', [
      {
        id: '99999991-9999-9999-9999-999999999991',
        site_id: 'aaaaaaa2-aaaa-aaaa-aaaa-aaaaaaaaaaa2',
        incident_type: 'near_miss',
        severity: 'moderate',
        event_date: now,
        location: 'Packing Line 2',
        people_involved: JSON.stringify([{ name: 'Operator Pema', role: 'Operator' }]),
        description: 'Forklift reversed into a pedestrian path without horn warning.',
        immediate_actions: 'Area isolated and operator briefed.',
        root_cause: 'Blind spot controls and pedestrian barrier discipline were weak.',
        status: 'validated',
        urgent_flag: false,
        submitted_at: now,
        validated_at: now,
        created_by: 'bbbbbbb3-bbbb-bbbb-bbbb-bbbbbbbbbbb3',
        updated_at: now,
        created_at: now
      }
    ]);

    await queryInterface.bulkInsert('incident_investigations', [
      {
        id: '99999992-9999-9999-9999-999999999992',
        incident_id: '99999991-9999-9999-9999-999999999991',
        investigator_id: 'bbbbbbb2-bbbb-bbbb-bbbb-bbbbbbbbbbb2',
        investigation_date: '2026-04-10',
        findings: 'Spotter controls were not enforced during reverse movement.',
        root_cause_analysis: 'Insufficient route demarcation and refresher training gaps.',
        recommendations: 'Install convex mirror and retrain forklift operators.',
        created_at: now,
        updated_at: now
      }
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('incident_investigations', null, {});
    await queryInterface.bulkDelete('incidents', null, {});
    await queryInterface.bulkDelete('inspection_findings', null, {});
    await queryInterface.bulkDelete('inspection_items', null, {});
    await queryInterface.bulkDelete('inspections', null, {});
  }
};
