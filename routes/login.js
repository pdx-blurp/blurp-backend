let express = require("express");
var passport = require('passport');

let router = express.Router();
// router.use();

var GoogleStrategy = require('passport-google-oauth20').Strategy;

let accessTokenStore = null;
let refreshTokenStore = null;
let profileStore = null;

passport.use(new GoogleStrategy({
    clientID: '220935592619-e7j93usk2h7vhcuoauos59rhgvqlcmsa.apps.googleusercontent.com',
    clientSecret: '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',
    callbackURL: "/login/google/redirect"
  },
  function (accessToken, refreshToken, profile, cb) {
    accessTokenStore = accessToken;
    refreshTokenStore = refreshToken;
    profileStore = profile;
    return cb(null, profileStore);
  }
));

router.get('/google', passport.authenticate('google', { scope: ['profile'] }));

router.get('/google/redirect',
  passport.authenticate('google', {failureRedirect: '/'}),
  function(req, res) {
    res.redirect(`http://localhost:5173?access_token=${accessTokenStore}`);
  }
);

passport.serializeUser(function(user, cb) {
  process.nextTick(function() {
    return cb(null, {
      id: user.id,
      username: user.username,
      picture: user.picture
    });
  });
});

passport.deserializeUser(function(user, cb) {
  process.nextTick(function() {
    return cb(null, user);
  });
});

module.exports = router;