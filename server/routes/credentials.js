const { Router } = require('express');
const { authRequired } = require('../middleware/authRequired');
const { Credential } = require('../models/Credential');

const router = Router();

router.use(authRequired);

// List metadata only
router.get('/', async (req, res) => {
  const items = await Credential.find({ user: req.user.id }).select(
    '-encrypted.ctB64 -encrypted.ivB64 -encrypted.saltB64 -encrypted.iterations'
  );
  res.json({ items });
});

// Create new credential (client-encrypted)
router.post('/', async (req, res) => {
  const { site, username, note, encrypted } = req.body;
  const item = await Credential.create({ user: req.user.id, site, username, note, encrypted });
  res.json({ item });
});

module.exports = router;
