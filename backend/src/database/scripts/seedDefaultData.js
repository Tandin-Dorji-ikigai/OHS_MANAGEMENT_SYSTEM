const { hashPassword } = require('../../utils/password');
const {
  sequelize,
  User,
  UserSite,
  Inspection,
  InspectionItem,
  InspectionFinding,
  Incident,
  IncidentInvestigation,
  RiskAssessment,
  RiskItem,
  Training,
  ToolboxMeeting,
  OhsActivity,
  OhsPlan,
  CorrectiveAction,
  Notification
} = require('../../models');
const { getDefaultData } = require('../masterData/defaultData');
const { printSeedSummary, upsertRecords } = require('./seedUtils');

async function seedDefaultData() {
  const passwordHash = await hashPassword('Password@123');
  const data = getDefaultData({ now: new Date(), passwordHash });

  await sequelize.transaction(async (transaction) => {
    await upsertRecords(User, data.users, transaction);
    await upsertRecords(UserSite, data.userSites, transaction);
    await upsertRecords(Inspection, data.inspections, transaction);
    await upsertRecords(InspectionItem, data.inspectionItems, transaction);
    await upsertRecords(InspectionFinding, data.inspectionFindings, transaction);
    await upsertRecords(Incident, data.incidents, transaction);
    await upsertRecords(IncidentInvestigation, data.incidentInvestigations, transaction);
    await upsertRecords(RiskAssessment, data.riskAssessments, transaction);
    await upsertRecords(RiskItem, data.riskItems, transaction);
    await upsertRecords(Training, data.trainings, transaction);
    await upsertRecords(ToolboxMeeting, data.toolboxMeetings, transaction);
    await upsertRecords(OhsActivity, data.ohsActivities, transaction);
    await upsertRecords(OhsPlan, data.ohsPlans, transaction);
    await upsertRecords(CorrectiveAction, data.correctiveActions, transaction);
    await upsertRecords(Notification, data.notifications, transaction);
  });

  printSeedSummary('users', data.users);
  printSeedSummary('user-site assignments', data.userSites);
  printSeedSummary('inspections', data.inspections);
  printSeedSummary('inspection items', data.inspectionItems);
  printSeedSummary('inspection findings', data.inspectionFindings);
  printSeedSummary('incidents', data.incidents);
  printSeedSummary('incident investigations', data.incidentInvestigations);
  printSeedSummary('risk assessments', data.riskAssessments);
  printSeedSummary('risk items', data.riskItems);
  printSeedSummary('trainings', data.trainings);
  printSeedSummary('toolbox meetings', data.toolboxMeetings);
  printSeedSummary('activities', data.ohsActivities);
  printSeedSummary('plans', data.ohsPlans);
  printSeedSummary('corrective actions', data.correctiveActions);
  printSeedSummary('notifications', data.notifications);
}

if (require.main === module) {
  seedDefaultData()
    .then(async () => {
      process.stdout.write('Default data seeding complete.\n');
      await sequelize.close();
    })
    .catch(async (error) => {
      process.stderr.write(`${error.stack || error.message}\n`);
      await sequelize.close();
      process.exit(1);
    });
}

module.exports = seedDefaultData;
