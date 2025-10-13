const { Router } = require('express');
const { authRequired } = require('../middleware/authRequired');
const { Otp } = require('../models/Otp');
const { Credential } = require('../models/Credential');
const { Audit } = require('../models/Audit');
const { transporter } = require('../config/mailer');
const { generateOtp, hashOtp, verifyOtpHash, expiryDate } = require('../utils/otp');
const { env } = require('../config/config');

const router = Router();
router.use(authRequired);

// Request OTP for credential view
router.post('/credentials/:id/request-otp', async (req, res) => {
  const cred = await Credential.findOne({ _id: req.params.id, user: req.user.id });
  if (!cred) return res.status(404).send('Not found');

  await Otp.updateMany({ user: req.user.id, credential: cred._id, used: false }, { used: true });

  const code = generateOtp();
  const codeHash = await hashOtp(code);

  await Otp.create({
    user: req.user.id,
    credential: cred._id,
    codeHash,
    expiresAt: expiryDate(),
    attempts: 0,
    maxAttempts: env.OTP_ATTEMPTS,
  });

  await transporter.sendMail({
    from: process.env.MAIL_USER,
    to: req.user.email,
    subject: 'Your MyLeakWatch OTP',
    text: `OTP: ${code} (valid for ${env.OTP_TTL_SEC / 60} minutes)`,
  });

  await Audit.create({ user: req.user.id, action: 'OTP_REQUEST', credential: cred._id, ip: req.ip, ua: req.headers['user-agent'] });

  res.json({ ok: true });
});

// Verify OTP and return encrypted blob
router.post('/credentials/:id/verify-otp', async (req, res) => {
  const cred = await Credential.findOne({ _id: req.params.id, user: req.user.id });
  if (!cred) return res.status(404).send('Not found');

  const latest = await Otp.findOne({ user: req.user.id, credential: cred._id, used: false }).sort({ createdAt: -1 });
  if (!latest) return res.status(400).send('No active OTP');
  if (latest.expiresAt.getTime() < Date.now()) return res.status(400).send('OTP expired');
  if (latest.attempts >= latest.maxAttempts) return res.status(429).send('Too many attempts');

  const ok = await verifyOtpHash(req.body.code, latest.codeHash);
  latest.attempts += 1;
  if (ok) latest.used = true;
  await latest.save();

  if (!ok) {
    await Audit.create({ user: req.user.id, action: 'OTP_VERIFY_FAIL', credential: cred._id, ip: req.ip, ua: req.headers['user-agent'] });
    return res.status(400).send('Invalid code');
  }

  await Audit.create({ user: req.user.id, action: 'OTP_VERIFY_OK', credential: cred._id, ip: req.ip, ua: req.headers['user-agent'] });
  res.json({ item: cred });
});

module.exports = router;
