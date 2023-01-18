let express = require('express');
const fs = require("fs");
let router = express.Router();

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
