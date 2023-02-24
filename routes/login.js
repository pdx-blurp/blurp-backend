let express = require("express");
var passport = require('passport');
let cors = require('cors');

let router = express.Router();
router.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:5173');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Credentials', true);
  next();
});

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
    req.session.userGoogleId = profileTemp.id; // Get unique user Google ID
    req.session.loggedIn = 'true';

    // Set loggedIn cookie and profilePicUrl cookie for the browser.
    // These cookies will expire when the session expires
    res.cookie('loggedIn', 'true', {maxAge: 1000 * 60 * 5, httpOnly: false});
    res.cookie('profilePicUrl', req.session.profile.photos[0].value,
      {maxAge: 1000 * 60 * 5, httpOnly: false});
    req.session.resetMaxAge();

    res.redirect(`http://localhost:5173`);
  }
);

router.get('/isloggedin', cors({origin: 'http://localhost:5173'}), (req, res, next) => {
  
  let ret = 'false';
  if(req.session.loggedIn) {
    ret = 'true';
  }
  res.json(ret);
});

router.get('/google/logout', cors({origin: 'http://localhost:5173'}), (req, res, next) => {
  delete req.session.refreshToken;
  delete req.session.accessToken;
  delete req.session.profile;
  delete req.session.useGoogleId;
  req.session.loggedIn = 'false';
  res.send('logged out');
});

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