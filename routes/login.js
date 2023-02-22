let express = require("express");
var passport = require('passport');

let router = express.Router();
let redirect_to = 'http://localhost:3000/test-login';

var GoogleStrategy = require('passport-google-oauth20').Strategy;

let accessTokenTemp = null;
let refreshTokenTemp = null;
let profileTemp = null;

passport.use(new GoogleStrategy({
    clientID: '220935592619-e7j93usk2h7vhcuoauos59rhgvqlcmsa.apps.googleusercontent.com',
    clientSecret: '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',
    callbackURL: "/login/google/redirect"
  },
  function (accessToken, refreshToken, profile, cb) {
    accessTokenTemp = accessToken;
    refreshTokenTemp = refreshToken;
    profileTemp = profile;
    return cb(null, profileTemp);
  }
));

router.get('/google', passport.authenticate('google', { scope: ['profile'], accessType: 'offline', prompt: 'consent'}));

router.get('/google/redirect',
  passport.authenticate('google', {failureRedirect: '/'}),
  function(req, res) {
    console.log("Session ID:", req.sessionID);
    req.session.refreshToken = refreshTokenTemp;
    req.session.accessToken = accessTokenTemp;
    req.session.profile = profileTemp;
    req.session.user_google_id = profileTemp.id; // Get unique user Google ID
    res.redirect(redirect_to);
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