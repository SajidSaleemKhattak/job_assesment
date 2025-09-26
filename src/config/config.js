require('dotenv').config();

module.exports = {
  port: process.env.PORT || 3000,
  targetUrl: process.env.TARGET_URL || 'https://www.adecco.nl/vacatures',
  logLevel: process.env.LOG_LEVEL || 'info'
};