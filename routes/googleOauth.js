const session = require('express-session');
const express = require('express');
const router = express.Router();
const passport = require('passport');
require('../auth');

router.use(express({ secret: 'cats'}));
router.use(passport.initialize());
router.use(passport.session());


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