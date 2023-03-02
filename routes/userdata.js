let express = require("express");
let router = express.Router();
router.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:5173");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Credentials", true);
  next();
});

let cors = require("cors");


// router.get("/profilepic", cors({origin: "http://localhost:5173"}), (req, res, next) => {

//   let ret = null;
//   // Make a request to Google API
//   if(req.session.profile == null) {
//     ret = "error";
//   }
//   else {
//     ret = req.session.profile.photos[0].value;
//   }
//   res.json(ret);
// });

module.exports = router;