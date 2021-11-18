require('dotenv').config();

let config = {
  port: process.env.PORT || '3000',
  cors: process.env.CORS || '*',
  email_support: process.env.EMAIL_SUPPORT || '',
  email_error: process.env.EMAIL_ERROR || '',
  node_env: process.env.NODE_ENV !== 'production',
};

const db = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
};

module.exports = { config, db };
