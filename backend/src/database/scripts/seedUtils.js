const printSeedSummary = (label, records) => {
  process.stdout.write(`Seeded ${label}: ${records.length}\n`);
};

const upsertRecords = async (Model, records, transaction) => {
  for (const record of records) {
    await Model.upsert(record, { transaction });
  }
};

module.exports = {
  printSeedSummary,
  upsertRecords
};
