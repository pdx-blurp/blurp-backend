let express = require("express");

let router = express.Router();

router.get("/", (req, res, next) => {
  console.log("test login requested");
  res.json(`hello, ${req.session.aname}, your session ID is ${req.sessionID}`);
  // res.json(req.session.profile);
});

router.post("/setname", (req, res, next) => {
  console.log("\n\n\nBODY\n",req.body,"\n\n\n");
  req.session.aname = req.body.aname;
  console.log("set name is ", req.session.aname);
  res.send("success");
});



module.exports = router;