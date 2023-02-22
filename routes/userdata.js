let express = require("express");
let router = express.Router();


router.get('/profilepic', (req, res, next) => {

  let ret = null;
  // Make a request to Google API
  let profile = req.session.profile;
  if(profile == null) {
    ret = 'error';
  }
  else {
    ret = profile.picture;
  }
  res.send(req.session.profile.photos[0].value);
});

module.exports = router;