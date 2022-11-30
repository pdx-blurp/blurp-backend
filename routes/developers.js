var express = require('express');
const devsJson = require("../public/devs.json");
var router = express.Router();

router.get('/', function(req, res, next) {
  const devsJson = require("../public/devs.json");
  res.render('developers', { json: devsJson });
});

module.exports = router;
