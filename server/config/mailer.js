const nodemailer = require('nodemailer');
const { env } = require('./config');

const transporter = nodemailer.createTransport({
  host: env.MAIL_HOST,
  port: env.MAIL_PORT,
  secure: true,
  auth: { user: env.MAIL_USER, pass: env.MAIL_PASS },
});

module.exports = { transporter };
