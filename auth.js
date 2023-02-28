const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { client } = require("./routes/dbhandler")
const crypto = require("crypto");


const GOOGLE_CLIENT_ID = '220935592619-e7j93usk2h7vhcuoauos59rhgvqlcmsa.apps.googleusercontent.com';
const GOOGLE_CLIENT_SECRET = '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';

passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:5500/google/callback"
    },
    function(accessToken, refreshToken, profile, done) {
        // check if user is already exist in db
        client
        .connect()
        .then((response) => {
            const database = response.db("blurp");
            const collection = database.collection("users");

        collection.findOne({authID: profile.id}).then((user) => {
            if (user) {
                console.log('user is:', user);
                cb(null, profile);
            }else { // create new user
                collection.insertOne({ authID: profile.id, UUID: crypto.randomUUID() })
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
