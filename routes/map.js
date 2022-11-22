var express = require('express');
var router = express.Router();

/* GET map page */
router.get('/', function(req, res, next) {
  // res.send('Hello, world! Map page.');
  res.render('map', { title: 'Express' });
});

module.exports = router;
