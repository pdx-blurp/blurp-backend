var express = require('express');
const tempJson = require("../public/tempDB.json");
var router = express.Router();

router.get('/', function(req, res, next) {
    const tempJson = require("../public/tempDB.json");
    res.render('testMaps', {tempJson: tempJson});
});

router.get('/json', function(req, res, next) {
    const tempJson = require("../public/tempDB.json");
    res.send(tempJson);
});

module.exports = router;