const session = require('express-session');
const express = require('express');
const router = express.Router();
const passport = require('passport');
const { client } = require("./dbhandler");
const crypto = require("crypto");

router.use(express({ secret: 'cats'}));
router.use(passport.initialize());
router.use(passport.session());

const GOOGLE_CLIENT_ID = '220935592619-e7j93usk2h7vhcuoauos59rhgvqlcmsa.apps.googleusercontent.com';
const GOOGLE_CLIENT_SECRET = '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';

var GoogleStrategy = require("passport-google-oauth20").Strategy;

passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:5500/google/callback"
    },
    function(accessToken, refreshToken, profile, done) {
        // check if user is already exist in db
        // connect to the db
        client
        .connect()
        .then((response) => {
            const database = response.db("blurp");
            const collection = database.collection("users");
        // check if user is already exist in db
        collection.findOne({authID: profile.id}).then((user) => {
            if (user) {
                console.log('user is:', user);
                cb(null, profile);
            }else { // create new user
                collection.insertOne({ authID: profile.id, userID: crypto.randomUUID() })
                .then((user) => {
                    console.log('new user created:'+ user);
                    cb(null, profile);
                });
            }
        }
        //return done(null, profile);
        )})}
));


passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(user, done) {
    done(null, user);
});


function isLoggedIn(req, res, next) {
    req.user ? next() : res.sendStatus(401);
}

router.get('/login', (req, res) => {
    //res.render('login');
    res.send('<a href="http://auth/google">Authenticate with Google</a>');
});

router.get('/google',
    passport.authenticate('google', { scope: ['profile'] }));

router.get('/google/callback', 
    passport.authenticate('google', { failureRedirect: '/login' }),
    function(req, res) {
      // Successful authentication, redirect home.
        res.redirect('/protected');
});

router.get('/protected/', isLoggedIn, (req, res) => {
    res.send('Hello ${req.user.displayName');
});

router.get('/logout', (req, res) => {
    req.logout();
    req.session.destroy();
    res.send('Goodbye!');
});


module.exports = router;