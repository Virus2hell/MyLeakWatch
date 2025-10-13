const { Router } = require('express');
const { authRequired } = require('../middleware/authRequired');
const { Credential } = require('../models/Credential');

const router = Router();
router.use(authRequired);

router.post('/extension/push', async (req, res) => {
  const { site, username, note, encrypted } = req.body;
  const existing = await Credential.findOne({ user: req.user.id, site, username });
  if (existing) {
    existing.encrypted = encrypted;
    if (note) existing.note = note;
    await existing.save();
    return res.json({ item: existing, updated: true });
  }
  const item = await Credential.create({ user: req.user.id, site, username, note, encrypted });
  res.json({ item, updated: false });
});

module.exports = router;
