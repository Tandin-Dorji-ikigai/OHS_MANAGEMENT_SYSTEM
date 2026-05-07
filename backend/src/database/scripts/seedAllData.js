const { sequelize } = require('../../models');
const seedMasterData = require('./seedMasterData');
const seedDefaultData = require('./seedDefaultData');

async function seedAllData() {
  await seedMasterData();
  await seedDefaultData();
  process.stdout.write('Master data and default data seeding complete.\n');
}

if (require.main === module) {
  seedAllData()
    .then(async () => {
      await sequelize.close();
    })
    .catch(async (error) => {
      process.stderr.write(`${error.stack || error.message}\n`);
      await sequelize.close();
      process.exit(1);
    });
}

module.exports = seedAllData;
