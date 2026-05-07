const env = require('./env');

const shared = {
  username: env.db.username,
  password: env.db.password,
  database: env.db.database,
  host: env.db.host,
  port: env.db.port,
  dialect: env.db.dialect
};

module.exports = {
  development: shared,
  test: shared,
  production: shared
};
