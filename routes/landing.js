const express = require("express");
const router = express.Router();

/* 
Using this to prevent the CORS blocked message that was popping up on front-end
https://stackoverflow.com/questions/58403651/react-component-has-been-blocked-by-cors-policy-no-access-control-allow-origin
*/
const cors = require("cors");
router.use(cors());

router.get("/pg1ex", (req, res) => {
	res.render("./pg1ex");
});

router.get("/pg2ex", (req, res) => {
	res.render("./pg2ex");
});

router.get("/test_login", (req, res) => {
  res.render("./test_login")
})

module.exports = router;
