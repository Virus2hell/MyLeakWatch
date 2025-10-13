const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { config } = require('./config');
const { User } = require('./models/User');

passport.use(
  new GoogleStrategy(
    {
      clientID: config.GOOGLE_CLIENT_ID,
      clientSecret: config.GOOGLE_CLIENT_SECRET,
      callbackURL: config.GOOGLE_CALLBACK_URL,
    },
    async (_accessToken, _refreshToken, profile, done) => {
      try {
        const email = profile.emails && profile.emails[0] && profile.emails[0].value;
        if (!email) return done(new Error('No email from Google'));
        let user = await User.findOne({ email });
        if (!user) user = await User.create({ email, name: profile.displayName, googleId: profile.id });
        return done(null, { id: user.id, email: user.email, name: user.name });
      } catch (e) {
        return done(e);
      }
    }
  )
);

module.exports = passport;
