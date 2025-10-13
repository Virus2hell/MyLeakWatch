// Single source of truth for env; no secrets are committed.
// Load from .env locally; in Node 20+ you can also run with: node --env-file=.env src/index.js
// Fails fast if required keys are missing. Twelve‑Factor compliant. [web:32][web:24][web:29]

if (!process.env._DOTENV_PRELOADED) {
  // Allow preloading via `node -r dotenv/config` or `--env-file`; fall back to programmatic load.
  try {
    // eslint-disable-next-line global-require
    require('dotenv').config();
    process.env._DOTENV_PRELOADED = '1';
  } catch {}
}

function requireVar(name) {
  const v = process.env[name];
  if (!v || v.trim() === '') {
    throw new Error(`Missing required env var: ${name}`);
  }
  return v;
}

const config = {
  PORT: Number(process.env.PORT || 4000),
  MONGO_URI: requireVar('MONGO_URI'),
  JWT_SECRET: requireVar('JWT_SECRET'),
  CLIENT_ORIGIN: process.env.CLIENT_ORIGIN || 'http://localhost:5173',

  MAIL_HOST: process.env.MAIL_HOST || 'smtp.gmail.com',
  MAIL_PORT: Number(process.env.MAIL_PORT || 465),
  MAIL_USER: requireVar('MAIL_USER'),
  MAIL_PASS: requireVar('MAIL_PASS'),

  GOOGLE_CLIENT_ID: requireVar('GOOGLE_CLIENT_ID'),
  GOOGLE_CLIENT_SECRET: requireVar('GOOGLE_CLIENT_SECRET'),
  GOOGLE_CALLBACK_URL: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:4000/api/auth/google/callback',

  OTP_TTL_SEC: Number(process.env.OTP_TTL_SEC || 300),
  OTP_ATTEMPTS: Number(process.env.OTP_ATTEMPTS || 5),
};

module.exports = { config };
