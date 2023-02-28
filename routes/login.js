let express = require("express");
var passport = require("passport");
let cors = require("cors");
let router = express.Router();
const { client } = require("./dbhandler");
const crypto = require("crypto");

// Login session lasts for 1 month
let SESSION_MAX_AGE = 30 * 24 * 3600000;

router.use((req, res, next) => {
	res.header("Access-Control-Allow-Origin", "http://localhost:5173");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	res.header("Access-Control-Allow-Credentials", true);
	next();
});

var GoogleStrategy = require("passport-google-oauth20").Strategy;
let profileTemp = null;

passport.use(
	new GoogleStrategy(
		{
			clientID: "220935592619-e7j93usk2h7vhcuoauos59rhgvqlcmsa.apps.googleusercontent.com",
			clientSecret: "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",
			callbackURL: "/login/google/redirect",
		},
		async function (accessToken, refreshToken, profile, cb) {
			profileTemp = profile;

			client.connect().then((response) => {
				const database = response.db("newMongoDB");
				const collection = database.collection("users");

				collection.findOne({ authID: profileTemp.id }).then((user) => {
					if (user) {
						console.log("user is:", user);
						// cb(null, profileTemp);
					} else {
						// create new user
						user = collection
							.insertOne({ googleID: profileTemp.id, userID: crypto.randomUUID() })
							.then((user) => {
								console.log("new user created:" + user);
								// cb(null, profileTemp);
							});
					}
				});
				return cb(null, profileTemp);
			});

		}
	)
);

router.get("/google", passport.authenticate("google", { scope: ["profile", "email"], prompt: "consent" }));

router.get("/google/redirect", passport.authenticate("google", { failureRedirect: "/" }), function (req, res) {
	req.session.userEmail = profileTemp.emails[0].value;
	req.session.userName = profileTemp.name.givenName;
	req.session.loggedIntoGoogle = "true";

	// Set loggedIntoGoogle cookie and profilePicUrl cookie for the browser.
	// These cookies will expire when the session expires
	res.cookie("loggedIntoGoogle", "true", { maxAge: SESSION_MAX_AGE, httpOnly: false });
	res.cookie("profilePicUrl", profileTemp.photos[0].value, { maxAge: SESSION_MAX_AGE, httpOnly: false });
	res.cookie("userName", profileTemp.name.givenName, { maxAge: SESSION_MAX_AGE, httpOnly: false });
	req.session.cookie.maxAge = SESSION_MAX_AGE;

	// STORE USER DATA IN DATABASE
	// If the user's GoogleId doesn't already exists in the database, add them.

	res.redirect(req.cookies.redirectAfterLogin);
});

router.get("/isloggedintogoogle", cors({ origin: "http://localhost:5173" }), (req, res, next) => {
	let ret = "false";
	if (req.session.loggedIntoGoogle) {
		ret = "true";
	}
	res.json(ret);
});

router.get("/google/logout", cors({ origin: "http://localhost:5173" }), (req, res, next) => {
	// Delete loggedIntoGoogle cookies
	res.clearCookie("loggedIntoGoogle");
	res.clearCookie("profilePicUrl");
	res.clearCookie("userName");
	res.clearCookie("connect.sid");
	req.session.cookie.maxAge = 1; // Have session expire immediately

	// Front-end logs out user if 'success' is returned
	res.json("success");
});

passport.serializeUser(function (user, cb) {
	process.nextTick(function () {
		return cb(null, {
			id: user.id,
		});
	});
});

passport.deserializeUser(function (user, cb) {
	process.nextTick(function () {
		return cb(null, user);
	});
});

module.exports = router;
