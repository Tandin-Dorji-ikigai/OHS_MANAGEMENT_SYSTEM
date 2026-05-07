'use strict';

const bcrypt = require('bcryptjs');

const roleIds = {
  hq: '11111111-1111-1111-1111-111111111111',
  field: '22222222-2222-2222-2222-222222222222',
  supervisor: '33333333-3333-3333-3333-333333333333',
  management: '44444444-4444-4444-4444-444444444444'
};

const siteIds = {
  hq: 'aaaaaaa1-aaaa-aaaa-aaaa-aaaaaaaaaaa1',
  plant: 'aaaaaaa2-aaaa-aaaa-aaaa-aaaaaaaaaaa2',
  mine: 'aaaaaaa3-aaaa-aaaa-aaaa-aaaaaaaaaaa3'
};

const userIds = {
  hq: 'bbbbbbb1-bbbb-bbbb-bbbb-bbbbbbbbbbb1',
  field: 'bbbbbbb2-bbbb-bbbb-bbbb-bbbbbbbbbbb2',
  supervisor: 'bbbbbbb3-bbbb-bbbb-bbbb-bbbbbbbbbbb3',
  management: 'bbbbbbb4-bbbb-bbbb-bbbb-bbbbbbbbbbb4'
};

module.exports = {
  async up(queryInterface) {
    const now = new Date();
    const passwordHash = bcrypt.hashSync('Password@123', 10);

    await queryInterface.bulkInsert('roles', [
      { id: roleIds.hq, name: 'HQ_SAFETY_OFFICER', description: 'Central OHS authority', created_at: now, updated_at: now },
      { id: roleIds.field, name: 'FIELD_SAFETY_OFFICER', description: 'Regional field reviewer', created_at: now, updated_at: now },
      { id: roleIds.supervisor, name: 'SAFETY_SUPERVISOR', description: 'Site operational supervisor', created_at: now, updated_at: now },
      { id: roleIds.management, name: 'TOP_MANAGEMENT', description: 'Read only executive user', created_at: now, updated_at: now }
    ]);

    await queryInterface.bulkInsert('sites', [
      {
        id: siteIds.hq,
        code: 'HQ-001',
        name: 'Corporate Headquarters',
        region: 'Central',
        country: 'Bhutan',
        address: 'Thimphu Corporate Office',
        site_type: 'Head Office',
        is_active: true,
        created_at: now,
        updated_at: now
      },
      {
        id: siteIds.plant,
        code: 'PLT-101',
        name: 'Phuentsholing Manufacturing Plant',
        region: 'West',
        country: 'Bhutan',
        address: 'Industrial Estate, Phuentsholing',
        site_type: 'Manufacturing Plant',
        is_active: true,
        created_at: now,
        updated_at: now
      },
      {
        id: siteIds.mine,
        code: 'MIN-210',
        name: 'Eastern Quarry Project',
        region: 'East',
        country: 'Bhutan',
        address: 'Mongar District Operations',
        site_type: 'Field Project',
        is_active: true,
        created_at: now,
        updated_at: now
      }
    ]);

    await queryInterface.bulkInsert('users', [
      {
        id: userIds.hq,
        role_id: roleIds.hq,
        first_name: 'Aum',
        last_name: 'Dorji',
        email: 'hq.safety@demo.local',
        phone_number: '+97517110001',
        employee_code: 'EMP-HQ-001',
        password_hash: passwordHash,
        department: 'Safety and Compliance',
        team_name: 'HQ Safety',
        is_active: true,
        created_at: now,
        updated_at: now
      },
      {
        id: userIds.field,
        role_id: roleIds.field,
        first_name: 'Karma',
        last_name: 'Wangdi',
        email: 'field.safety@demo.local',
        phone_number: '+97517110002',
        employee_code: 'EMP-FLD-002',
        password_hash: passwordHash,
        department: 'Field Safety',
        team_name: 'Regional West',
        is_active: true,
        created_at: now,
        updated_at: now
      },
      {
        id: userIds.supervisor,
        role_id: roleIds.supervisor,
        first_name: 'Sonam',
        last_name: 'Choden',
        email: 'supervisor@demo.local',
        phone_number: '+97517110003',
        employee_code: 'EMP-SUP-003',
        password_hash: passwordHash,
        department: 'Operations',
        team_name: 'Plant Safety',
        is_active: true,
        created_at: now,
        updated_at: now
      },
      {
        id: userIds.management,
        role_id: roleIds.management,
        first_name: 'Tashi',
        last_name: 'Namgay',
        email: 'management@demo.local',
        phone_number: '+97517110004',
        employee_code: 'EMP-MGT-004',
        password_hash: passwordHash,
        department: 'Executive Office',
        team_name: 'Leadership',
        is_active: true,
        created_at: now,
        updated_at: now
      }
    ]);

    await queryInterface.bulkInsert('user_sites', [
      { id: 'ccccccc1-cccc-cccc-cccc-ccccccccccc1', user_id: userIds.hq, site_id: siteIds.hq, is_primary: true, created_at: now, updated_at: now },
      { id: 'ccccccc2-cccc-cccc-cccc-ccccccccccc2', user_id: userIds.hq, site_id: siteIds.plant, is_primary: false, created_at: now, updated_at: now },
      { id: 'ccccccc3-cccc-cccc-cccc-ccccccccccc3', user_id: userIds.hq, site_id: siteIds.mine, is_primary: false, created_at: now, updated_at: now },
      { id: 'ccccccc4-cccc-cccc-cccc-ccccccccccc4', user_id: userIds.field, site_id: siteIds.plant, is_primary: true, created_at: now, updated_at: now },
      { id: 'ccccccc5-cccc-cccc-cccc-ccccccccccc5', user_id: userIds.field, site_id: siteIds.mine, is_primary: false, created_at: now, updated_at: now },
      { id: 'ccccccc6-cccc-cccc-cccc-ccccccccccc6', user_id: userIds.supervisor, site_id: siteIds.plant, is_primary: true, created_at: now, updated_at: now },
      { id: 'ccccccc7-cccc-cccc-cccc-ccccccccccc7', user_id: userIds.management, site_id: siteIds.hq, is_primary: true, created_at: now, updated_at: now }
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('user_sites', null, {});
    await queryInterface.bulkDelete('users', null, {});
    await queryInterface.bulkDelete('sites', null, {});
    await queryInterface.bulkDelete('roles', null, {});
  }
};
