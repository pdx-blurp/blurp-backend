const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

const GOOGLE_CLIENT_ID = '220935592619-e7j93usk2h7vhcuoauos59rhgvqlcmsa.apps.googleusercontent.com';
const GOOGLE_CLIENT_SECRET = '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';

passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:5500/google/callback"
    },
    function(accessToken, refreshToken, profile, done) {
        // check if user is already exist in db
        db.collection('account').findOne({authID: profile.id}).then((currentUser) => {
            if (currentUser) {
                console.log('user is:', currentUser);
                done(null, currentUser);
            }else { // create new user
                db.collection('account').insertOne({ authID: profile.id }).save()
                .then((newUser) => {
                    console.log('new user created:'+ newUser);
                    done(null, newUser);
                });
            }
        }
        //return done(null, profile);
        )}
));

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(user, done) {
    done(null, user);
});
