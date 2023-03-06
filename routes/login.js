let express = require("express");
let cors = require("cors");
let router = express.Router();
const { client } = require("./dbhandler");
const crypto = require("crypto");
const { URLSearchParams } = require("url");

let frontend_url = 'http://localhost:5173';

router.use(cors({credentials: true, origin: frontend_url}));

// Login session lasts for 1 month
let SESSION_MAX_AGE = 30 * 24 * 3600;

router.use((req, res, next) => {
	res.header("Access-Control-Allow-Origin", frontend_url);
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	res.header("Access-Control-Allow-Credentials", true);
	next();
});

router.get("/google", cors({origin: frontend_url}), (req, res, next) => {
	let success = 'false';
	let userName = null;
	let googleID = null;
	let profileUrl = null;

	let accessToken = req.query.accessToken;
	console.log('\n\n\nACCESS TOKEN:', accessToken);
	// accessToken = 'ya29.a0AVvZVsqYjD2ijVQ5vco6PDGCgXfnVREKwrs46K9fDXPb1kKZ0lB4uFDTfOw5kTJsCXRLKqeonSzdkpQlGZ3Ok7omdRX5OdynOQ4mQzwRT50SGRCM70qa2nFiZgeaGlodPqK_EdFp1jZPfB2qrjHlMMlGm9uSmQaCgYKAYwSARESFQGbdwaI3AHzRMN8AdTVbJY099dB6g0165';
	let url = `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${accessToken}`;
	let headers = {
		Authorization: `Basic ${accessToken}`,
		Accept: 'application/json'
	};
	fetch(url, {
		headers: headers
	}).then(result => result.json()).then((result) => {
		console.log('\n\n\n\nGOOGLE RETURNED:', result);
		googleID = result.id;
		req.session.cookie.maxAge = SESSION_MAX_AGE * 1000;
		if(googleID == undefined) {
			res.json({
				'success': false
			});
		}
		else 
		{
			res.json({
				'success': true,
				'userName': result.given_name,
				'profileUrl': result.picture,
				'maxAge': SESSION_MAX_AGE,
			});
		}
	})
	.catch((err) => {
		console.log('\n\n\nERROR');
		res.json({
			'success': false
		});
	});
});


router.get("/google/logout", cors({origin: frontend_url}), (req, res, next) => {
	console.log("\n\n\nDELETING SESSION:", req.session.id);
	req.session.cookie.maxAge = 1;
	res.json({'success': true});
});

module.exports = router;