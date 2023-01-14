const express = require('express');
const router = express.Router();
// when using actual database, we'll need to change this to the connection
const mapData = require('../public/devs.json');
console.log(mapData);

router.get('/', function(req, res, next) {
  console.log(mapData);
  res.send(mapData);
});

module.exports = router
