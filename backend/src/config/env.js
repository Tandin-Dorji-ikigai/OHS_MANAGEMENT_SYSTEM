const dotenv = require('dotenv');

dotenv.config();

module.exports = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT || 5000),
  appName: process.env.APP_NAME || 'OHS Management System',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  db: {
    dialect: process.env.DB_DIALECT || 'postgres',
    host: process.env.DB_HOST || '127.0.0.1',
    port: Number(process.env.DB_PORT || 5432),
    database: process.env.DB_NAME || 'ohs_management',
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || ''
  },
  jwt: {
    accessSecret: process.env.JWT_ACCESS_SECRET || 'unsafe-dev-access-secret',
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'unsafe-dev-refresh-secret',
    accessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d'
  },
  bcryptSaltRounds: Number(process.env.BCRYPT_SALT_ROUNDS || 10),
  maxUploadSizeMb: Number(process.env.MAX_UPLOAD_SIZE_MB || 10)
};
