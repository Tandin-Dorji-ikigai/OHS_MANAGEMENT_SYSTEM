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

const userSiteIds = {
  hqPrimary: 'ccccccc1-cccc-cccc-cccc-ccccccccccc1',
  hqPlant: 'ccccccc2-cccc-cccc-cccc-ccccccccccc2',
  hqMine: 'ccccccc3-cccc-cccc-cccc-ccccccccccc3',
  fieldPlant: 'ccccccc4-cccc-cccc-cccc-ccccccccccc4',
  fieldMine: 'ccccccc5-cccc-cccc-cccc-ccccccccccc5',
  supervisorPlant: 'ccccccc6-cccc-cccc-cccc-ccccccccccc6',
  managementHq: 'ccccccc7-cccc-cccc-cccc-ccccccccccc7'
};

const inspectionIds = {
  approvedPpe: 'ddddddd1-dddd-dddd-dddd-ddddddddddd1',
  pendingHousekeeping: 'ddddddd2-dddd-dddd-dddd-ddddddddddd2'
};

const inspectionItemIds = {
  ppeCompliant: 'eeeeeee1-eeee-eeee-eeee-eeeeeeeeeee1',
  missingLabels: 'eeeeeee2-eeee-eeee-eeee-eeeeeeeeeee2',
  housekeepingZone: 'eeeeeee3-eeee-eeee-eeee-eeeeeeeeeee3'
};

const inspectionFindingIds = {
  labelNonConformance: 'fffffff1-ffff-ffff-ffff-fffffffffff1',
  openHousekeeping: 'fffffff2-ffff-ffff-ffff-fffffffffff2'
};

const incidentIds = {
  forkliftNearMiss: '99999991-9999-9999-9999-999999999991',
  quarryInjury: '99999993-9999-9999-9999-999999999993'
};

const incidentInvestigationIds = {
  forkliftNearMiss: '99999992-9999-9999-9999-999999999992',
  quarryInjury: '99999994-9999-9999-9999-999999999994'
};

const riskAssessmentIds = {
  quarryBlasting: '77777771-7777-7777-7777-777777777771'
};

const riskItemIds = {
  flyRock: '77777772-7777-7777-7777-777777777772',
  dustExposure: '77777773-7777-7777-7777-777777777773'
};

const trainingIds = {
  forkliftRefresher: '66666661-6666-6666-6666-666666666661'
};

const toolboxMeetingIds = {
  weeklyToolbox: '55555551-5555-5555-5555-555555555551'
};

const activityIds = {
  awarenessSession: '44444441-aaaa-bbbb-cccc-111111111111'
};

const planIds = {
  annualPlan: '33333331-aaaa-bbbb-cccc-111111111111'
};

const correctiveActionIds = {
  relabelDrums: '22222221-aaaa-bbbb-cccc-111111111111',
  walkwayBarrier: '22222222-aaaa-bbbb-cccc-111111111111'
};

const notificationIds = {
  inspectionSubmitted: '12121212-aaaa-bbbb-cccc-111111111111',
  overdueAction: '12121213-aaaa-bbbb-cccc-111111111111'
};

module.exports = {
  roleIds,
  siteIds,
  userIds,
  userSiteIds,
  inspectionIds,
  inspectionItemIds,
  inspectionFindingIds,
  incidentIds,
  incidentInvestigationIds,
  riskAssessmentIds,
  riskItemIds,
  trainingIds,
  toolboxMeetingIds,
  activityIds,
  planIds,
  correctiveActionIds,
  notificationIds
};
