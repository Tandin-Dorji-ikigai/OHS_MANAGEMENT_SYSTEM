const bcrypt = require('bcryptjs');
const env = require('../config/env');

const hashPassword = (value) => bcrypt.hash(value, env.bcryptSaltRounds);
const comparePassword = (value, hash) => bcrypt.compare(value, hash);

module.exports = {
  hashPassword,
  comparePassword
};
