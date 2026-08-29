require('dotenv').config();

module.exports = {
  JWT_SECRET: process.env.JWT_SECRET || 'meridian-demo-secret-do-not-use-in-production',
  JWT_EXPIRES_IN: '7d',
  PORT: process.env.PORT || 3001,
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/meridian',
};