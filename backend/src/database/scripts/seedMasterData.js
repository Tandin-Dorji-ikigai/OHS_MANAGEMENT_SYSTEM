const { sequelize, Role, Site } = require('../../models');
const { getMasterData } = require('../masterData/masterData');
const { printSeedSummary, upsertRecords } = require('./seedUtils');

async function seedMasterData() {
  const data = getMasterData(new Date());

  await sequelize.transaction(async (transaction) => {
    await upsertRecords(Role, data.roles, transaction);
    await upsertRecords(Site, data.sites, transaction);
  });

  printSeedSummary('roles', data.roles);
  printSeedSummary('sites', data.sites);
}

if (require.main === module) {
  seedMasterData()
    .then(async () => {
      process.stdout.write('Master data seeding complete.\n');
      await sequelize.close();
    })
    .catch(async (error) => {
      process.stderr.write(`${error.stack || error.message}\n`);
      await sequelize.close();
      process.exit(1);
    });
}

module.exports = seedMasterData;
