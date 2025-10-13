const { Router } = require('express');
const passport = require('../config/passport');
const { signSession, setSessionCookie } = require('../utils/jwt');

const router = Router();

router.get('/google', passport.authenticate('google', { scope: ['email', 'profile'] }));

router.get(
  '/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: '/' }),
  (req, res) => {
    const token = signSession({ sub: req.user.id, email: req.user.email });
    setSessionCookie(res, token);
    res.redirect(process.env.CLIENT_ORIGIN || 'http://localhost:5173');
  }
);

// Current user (populated by index middleware)
router.get('/me', (req, res) => {
  if (!req.user) return res.json({ user: null });
  res.json({ user: req.user });
});

router.post('/logout', (req, res) => {
  res.clearCookie('sid', { path: '/' });
  res.json({ ok: true });
});

module.exports = router;
