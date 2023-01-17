const express = require("express");

const router = express.Router();
const dev = require("../public/devs.json");

router.get("/map/get/:name", (req, res) => {
  const { name } = req.params;
  const found = dev.find((devObj) => devObj.name === name);
  if (found) {
    const singleDev = dev.filter((devObj) => devObj.name === name);
    res.status(200).json(singleDev);
  } else {
    res.status(404).json({ message: "Developer not found" });
  }
});

router.patch("/map/update/:name", (req, res) => {
  const { name } = req.params;
  const update = req.body;
  const found = dev.find((devObj) => devObj.name === name);

  if (found) {
    Object.assign(found, update);
    res.status(200).json(found);
  } else {
    res.status(404).json({ mess: "developer not found" });
  }
});
module.exports = router;
