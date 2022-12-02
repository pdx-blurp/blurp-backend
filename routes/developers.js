var express = require('express');
const devsJson = require("../public/devs.json");
var router = express.Router();

router.get('/', function(req, res, next) {
  const devsJson = require("../public/devs.json");
  res.render('developers', { devsJson: devsJson });
});

router.get('/json', function(req, res, next) {
  const devsJson = require("../public/devs.json");
  res.send(devsJson);
});

module.exports = router;
