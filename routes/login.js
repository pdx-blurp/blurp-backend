let express = require("express");
let cors = require("cors");
let router = express.Router();
const { client } = require("./dbhandler");
const crypto = require("crypto");

let FRONTEND_URL = 'http://localhost:5173';

router.use(cors({credentials: true, origin: FRONTEND_URL}));

// Login session lasts for 1 month
let SESSION_MAX_AGE = 30 * 24 * 3600;

// Provide googleID, get userID (UUID) as promise.
// The googleID is the key to the userID.
function get_userID (googleID) {
	return new Promise((resolve, reject) => {
		let userID = null;
		client.connect().then((res) => {
			const database = res.db("blurp");
			const collection = database.collection("users");

			// Search for userID using googleID
			collection.findOne({googleID: googleID}).then((user) => {
				// If user already exists
				if(user) {
					userID = user.userID;
					resolve(userID);
				}
				else {
					userID = crypto.randomUUID();
					collection
					.insertOne({googleID: googleID, userID: userID})
					.then((user) => {
						resolve(userID);
					})
					.catch((err) => {
						resolve(null);
					});
				}
			});
		}).catch((err) => {
			resolve(null);
		});
	});
}

router.use((req, res, next) => {
	res.header("Access-Control-Allow-Origin", FRONTEND_URL);
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	res.header("Access-Control-Allow-Credentials", true);
	next();
});

router.get("/google", cors({origin: FRONTEND_URL}), (req, res, next) => {
	let googleID = null;
	let accessToken = req.query.accessToken;
	let url = `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${accessToken}`;
	let headers = {
		Authorization: `Basic ${accessToken}`,
		Accept: 'application/json'
	};
	fetch(url, {
		headers: headers
	}).then(result => result.json()).then((result) => {
		googleID = result.id;
		req.session.cookie.maxAge = SESSION_MAX_AGE * 1000; // maxAge is in ms
		if(googleID == undefined || googleID == null) {
			res.json({
				'success': false
			});
		}
		else {
			// If successful, retrieve user from database (or add them)
			get_userID(googleID).then((userID) => {
				// If couldn't find and couldn't create, error
				if(userID == null) {
					res.json({
						'success': false
					});
				}
				else {
					req.session.userID = userID;
					res.json({
						'success': true,
						'userName': result.given_name,
						'profileUrl': result.picture,
						'maxAge': SESSION_MAX_AGE,
					});
				}
			});
		}
	})
	.catch((err) => {
		res.json({
			'success': false
		});
	});
});


router.get("/google/logout", cors({origin: FRONTEND_URL}), (req, res, next) => {
	req.session.cookie.maxAge = 1;
	res.json({'success': true});
});

module.exports = router;