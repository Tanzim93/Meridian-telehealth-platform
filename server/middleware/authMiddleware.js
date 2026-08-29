const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/env');

function authRequired(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return res.status(401).json({ error: 'Missing auth token' });
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.patientId = payload.patientId; // MongoDB ObjectId string
    next();
  } catch (e) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}

module.exports = { authRequired };
