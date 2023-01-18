let express = require('express');
const fs = require("fs");
let router = express.Router();

/**
 * Root map endpoint, get request, returns all names including the team they belong to
 */

router.get('/', (req, res, next) => {
	res.send(JSON.parse(fs.readFileSync(__dirname + "/../public/devs.json", 'utf-8')));
});

/**
 * Create endpoint, which takes name and team parameters from the request body.
 * The name and team must be specified to create a new entry.
 */

router.post('/create', function (req, res, next) {
    // Grab the parameters from the request body that we need
    const {name, team} = req.body;

    // Ensure name and team are specified
    if (!name || !team) {
        res.status(400).send("Must specify name and team!");
    }

    // This assumes the file already exists (and it should)
    let json = JSON.parse(fs.readFileSync(__dirname + "/../public/devs.json", 'utf-8'));

    // Add name and team to JSON
    json.push({name, team});

    // Write new changes to file
    fs.writeFile(__dirname + "/../public/devs.json", JSON.stringify(json), function (err) {
        if (err) {
            res.status(400).send("Issue writing file!");
        }
    });

    // Send JSON with new changes
    res.send(json);
});

/**
 * Get endpoint, which takes the name parameter and returns the entire developer object
 */

router.get("/get", function (req, res, next) {
  const { name } = req.body;
  let dev = JSON.parse(fs.readFileSync(__dirname + "/../public/devs.json", 'utf-8'));

  const found = dev.find((devObj) => devObj.name === name);
  if (found) {
    const singleDev = dev.filter((devObj) => devObj.name === name);
    res.status(200).json(singleDev);
  } else {
    res.status(404).json({ message: "Developer not found" });
  }
});

/**
 * Update endpoint, which takes the name parameter and updates the developer in the devs.json
 */

router.patch("/update", function (req, res, next) {
  const { name, update } = req.body;
  let dev = JSON.parse(fs.readFileSync(__dirname + "/../public/devs.json", 'utf-8'));
  const found = dev.findIndex((devObj) => devObj.name === name);

  if (found !== -1) {
    Object.assign(dev[found], update);
    fs.writeFile(__dirname + "/../public/devs.json", JSON.stringify(dev), function (err) {
        if (err) {
            res.status(400).send("Issue writing file!");
        }
    });
    res.status(200).json(dev[found]);
  } else {
    res.status(404).json({ mess: "developer not found" });
  }
});


/**
 * Delete endpoint, which takes name and team parameters from the request body.
 * The name and team must be specified to remove zero or more entries, where multiple removals would occur when
 * multiple matches to the specified name and team parameters are present, or no removals if there are no matches.
 */
router.delete('/delete', function (req, res, next) {
    // Grab the parameters from the request body that we need
    const {name, team} = req.body;

    // Ensure name and team are specified
    if (!name || !team) {
        res.status(400).send("Must specify name and team!");
    }

    // This assumes the file already exists (and it should)
    let json = JSON.parse(fs.readFileSync(__dirname + "/../public/devs.json", 'utf-8'));

    // Remove name and team from JSON
    // This also removes duplicate instances
    json = json.filter(function (e) {
        return e.name !== name && e.team !== team;
    });

    // Write new changes to file
    fs.writeFile(__dirname + "/../public/devs.json", JSON.stringify(json), function (err) {
        if (err) {
            res.status(400).send("Issue writing file!");
        }
    });

    // Send JSON with new changes
    res.send(json);
});

module.exports = router;
