const { Sequelize } = require('sequelize');
const env = require('./env');

module.exports = new Sequelize(env.db.database, env.db.username, env.db.password, {
  host: env.db.host,
  port: env.db.port,
  dialect: env.db.dialect,
  logging: false,
  define: {
    underscored: true,
    timestamps: true,
    paranoid: true
  }
});
