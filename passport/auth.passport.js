const passport = require('passport');
const Member = require('../models/member');
const GoogleStrategy = require('passport-google-oauth2').Strategy;
const brcypt = require('bcrypt');

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: 'http://localhost:8080/auth/google/callback',
      passReqToCallback: true,
    },
    async function (request, accessToken, refreshToken, profile, done) {
      try {
        let member = await Member.findOne({ email: profile.email });

        if (!member) {
          member = await Member.create({
            membername: profile.displayName,
            password: await brcypt.hash(profile.id, 10),
            email: profile.email,
            isAdmin: false,
          });
        }

        return done(null, member);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

passport.serializeUser(function (member, done) {
  done(null, member.id);
});

passport.deserializeUser(async function (id, done) {
  try {
    const member = await Member.findById(id);
    done(null, member);
  } catch (err) {
    done(err, null);
  }
});

module.exports = passport;
