const jwt = require('jsonwebtoken');
const { env } = require('../config/config');

function authRequired(req, res, next) {
  const token = req.cookies && req.cookies.sid;
  if (!token) return res.status(401).send('Unauthenticated');
  try {
    const payload = jwt.verify(token, env.JWT_SECRET);
    req.user = { id: payload.sub, email: payload.email };
    next();
  } catch {
    return res.status(401).send('Invalid session');
  }
}

module.exports = { authRequired };
