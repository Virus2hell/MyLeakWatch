require('dotenv/config');

const env = {
  PORT: Number(process.env.PORT || 4000),
  MONGO_URI: process.env.MONGO_URI,
  JWT_SECRET: process.env.JWT_SECRET,
  CLIENT_ORIGIN: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
  MAIL_HOST: process.env.MAIL_HOST || 'smtp.gmail.com',
  MAIL_PORT: Number(process.env.MAIL_PORT || 465),
  MAIL_USER: process.env.MAIL_USER,
  MAIL_PASS: process.env.MAIL_PASS,
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
  GOOGLE_CALLBACK_URL: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:4000/api/auth/google/callback',
  OTP_TTL_SEC: Number(process.env.OTP_TTL_SEC || 300),
  OTP_ATTEMPTS: Number(process.env.OTP_ATTEMPTS || 5),
};

module.exports = { env };
