let express = require('express');
const fs = require("fs");
let router = express.Router();
const crypto = require('crypto');

/**
 * Create endpoint, which takes two node parameters to link together, as well as relationship info.
 */
router.post('/create', function (req, res, next) {
    // Grab the parameters from the request body that we need
    const {node1, node2, relationship} = req.body;

    // Ensure node1, node2, and relationship are specified
    if (!node1 || !node2 || !relationship) {
        res.status(400).send("Must specify node1, node2, and relationship!");
        return;
    }

    // This assumes the file already exists (and it should)
    let json = JSON.parse(fs.readFileSync(__dirname + "/../public/relationships.json", 'utf-8'));

    let id = crypto.randomUUID();

    // Add to JSON
    json.push({id, node1, node2, relationship});

    // Write new changes to file
    fs.writeFile(__dirname + "/../public/relationships.json", JSON.stringify(json), function (err) {
        if (err) {
            res.status(400).send("Issue writing file!");
        }
    });

    // Send JSON with new changes
    res.send(json);
});


/**
 * Delete endpoint, which takes the relationship id.
 */
router.delete('/delete', function (req, res, next) {
    // Grab the parameters from the request body that we need
    const {id} = req.body;

    // Ensure id is specified
    if (!id) {
        res.status(400).send("Must specify id!");
        return;
    }

    // This assumes the file already exists (and it should)
    let json = JSON.parse(fs.readFileSync(__dirname + "/../public/relationships.json", 'utf-8'));

    // Remove by id from json
    // This also removes duplicate instances
    json = json.filter(function (e) {
        return e.id !== id;
    });

    // Write new changes to file
    fs.writeFile(__dirname + "/../public/relationships.json", JSON.stringify(json), function (err) {
        if (err) {
            res.status(400).send("Issue writing file!");
        }
    });

    // Send JSON with new changes
    res.send(json);
});

/**
 * Update endpoint, which takes the relationship id and relationship data to update.
 */
router.put('/update', function (req, res, next) {
    // Grab the parameters from the request body that we need
    const {id, relationship} = req.body;

    // Ensure id is specified
    if (!id || !relationship) {
        res.status(400).send("Must specify id and relationship!");
        return;
    }

    // This assumes the file already exists (and it should)
    let json = JSON.parse(fs.readFileSync(__dirname + "/../public/relationships.json", 'utf-8'));

    // Grab the record to update
    let recordToUpdate = json.filter(function (e) {
        return e.id === id;
    })[0];
    // Remove the record by id to add later
    json = json.filter(function (e) {
        return e.id !== id;
    });

    recordToUpdate.relationship = relationship;
    let node1 = recordToUpdate.node1;
    let node2 = recordToUpdate.node2;

    // Add name and team to JSON
    json.push({id, node1, node2, relationship});

    // Write new changes to file
    fs.writeFile(__dirname + "/../public/relationships.json", JSON.stringify(json), function (err) {
        if (err) {
            res.status(400).send("Issue writing file!");
        }
    });

    // Send JSON with new changes
    res.send(json);
});


/**
 * Get endpoint, which takes a single relationship id.
 */
router.get('/get', function (req, res, next) {
    // Grab the parameters from the request body that we need
    const {id} = req.body;

    // Ensure id is specified
    if (!id) {
        res.status(400).send("Must specify id!");
        return;
    }

    // This assumes the file already exists (and it should)
    let json = JSON.parse(fs.readFileSync(__dirname + "/../public/relationships.json", 'utf-8'));

    // Grab the record to update
    let matchedRecord = json.filter(function (e) {
        return e.id === id;
    })[0];

    // Send matched JSON
    res.send(matchedRecord);
});

/**
 * Root endpoint, which sends all relationships.
 */
router.get('/', function (req, res, next) {
    // This assumes the file already exists (and it should)
    let json = JSON.parse(fs.readFileSync(__dirname + "/../public/relationships.json", 'utf-8'));

    // Send all JSON
    res.send(json);
});

module.exports = router;
