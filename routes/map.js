const express = require('express')
const router = express.Router()

// when using actual database, we'll need to change this to the connection
const mapData = require('../public/devs.json');

router.get('/map', (req, res) => {
	res.send(mapData)
});
