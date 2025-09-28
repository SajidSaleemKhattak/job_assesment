const config = require('../config/config');

// Simple API key auth via header: x-api-key, compares to process.env.API_KEY
module.exports = function apiKeyAuth(req, res, next) {
  const provided = req.header('x-api-key') || req.query.apiKey;
  const expected = process.env.API_KEY || '';
  if (!expected) {
    // If no API_KEY configured, treat as open for development, but warn in logs via console
    console.warn('Warning: API_KEY is not set. Write operations are not protected.');
    return next();
  }
  if (!provided || provided !== expected) {
    return res.status(401).json({ status: 'error', message: 'Unauthorized: invalid API key' });
  }
  next();
};
