const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const { env } = require('../config/env');

function generateOtp() {
  const n = crypto.randomInt(0, 1_000_000);
  return n.toString().padStart(6, '0');
}

async function hashOtp(code) {
  return bcrypt.hash(code, 10);
}

async function verifyOtpHash(code, hash) {
  return bcrypt.compare(code, hash);
}

function expiryDate() {
  return new Date(Date.now() + env.OTP_TTL_SEC * 1000);
}

module.exports = { generateOtp, hashOtp, verifyOtpHash, expiryDate };
