const express = require("express");
const router = express.Router();

router.get("/pg1ex", (req, res) => {
	res.render('./pg1ex')
})

router.get("/pg2ex", (req, res) => {
	res.render('./pg2ex')
})

router.get('/test_login', (req, res) => {
  res.render('./test_login')
})

module.exports = router;