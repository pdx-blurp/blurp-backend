const express = require('express');
const router = express.Router();
const dotenv = require('dotenv');
dotenv.config();

/* GET home page. */
router.get('/', function (req, res, next) {
	res.render('index', {title: 'Express', text: 'Hello'});
});

module.exports = router;
