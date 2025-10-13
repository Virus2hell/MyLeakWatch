const jwt = require('jsonwebtoken');
const { env } = require('../config/config');

function signSession(payload) {
  return jwt.sign(payload, env.JWT_SECRET, { expiresIn: '7d' });
}

function setSessionCookie(res, token) {
  res.cookie('sid', token, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 7 * 24 * 3600 * 1000,
  });
}

module.exports = { signSession, setSessionCookie };
