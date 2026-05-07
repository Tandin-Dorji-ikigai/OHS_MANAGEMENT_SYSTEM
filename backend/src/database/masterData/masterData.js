const { roleIds, siteIds } = require('./ids');

const withTimestamps = (record, now) => ({
  ...record,
  createdAt: now,
  updatedAt: now
});

const getMasterData = (now = new Date()) => ({
  roles: [
    withTimestamps(
      {
        id: roleIds.hq,
        name: 'HQ_SAFETY_OFFICER',
        description: 'Central OHS authority'
      },
      now
    ),
    withTimestamps(
      {
        id: roleIds.field,
        name: 'FIELD_SAFETY_OFFICER',
        description: 'Regional field reviewer'
      },
      now
    ),
    withTimestamps(
      {
        id: roleIds.supervisor,
        name: 'SAFETY_SUPERVISOR',
        description: 'Site operational supervisor'
      },
      now
    ),
    withTimestamps(
      {
        id: roleIds.management,
        name: 'TOP_MANAGEMENT',
        description: 'Read only executive user'
      },
      now
    )
  ],
  sites: [
    withTimestamps(
      {
        id: siteIds.hq,
        code: 'HQ-001',
        name: 'Corporate Headquarters',
        region: 'Central',
        country: 'Bhutan',
        address: 'Thimphu Corporate Office',
        siteType: 'Head Office',
        isActive: true
      },
      now
    ),
    withTimestamps(
      {
        id: siteIds.plant,
        code: 'PLT-101',
        name: 'Phuentsholing Manufacturing Plant',
        region: 'West',
        country: 'Bhutan',
        address: 'Industrial Estate, Phuentsholing',
        siteType: 'Manufacturing Plant',
        isActive: true
      },
      now
    ),
    withTimestamps(
      {
        id: siteIds.mine,
        code: 'MIN-210',
        name: 'Eastern Quarry Project',
        region: 'East',
        country: 'Bhutan',
        address: 'Mongar District Operations',
        siteType: 'Field Project',
        isActive: true
      },
      now
    )
  ]
});

module.exports = {
  getMasterData
};
