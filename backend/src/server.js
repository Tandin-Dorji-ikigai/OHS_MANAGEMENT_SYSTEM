const app = require('./app');
const env = require('./config/env');
const { sequelize } = require('./models');

const start = async () => {
  try {
    await sequelize.authenticate();
    app.listen(env.port, () => {
      process.stdout.write(`API running on port ${env.port}\n`);
    });
  } catch (error) {
    process.stderr.write(`${error.message}\n`);
    process.exit(1);
  }
};

start();
