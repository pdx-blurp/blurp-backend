let express = require("express");
const fs = require("fs");
let router = express.Router();
const crypto = require("crypto");
const { client } = require("./dbhandler")

/**
 * Root map endpoint, expects a userID value and returns a list of objects that contain userName
 * and mapID that the userID owns. 
 */

router.get('/', (req, res, next) => {
  // Expects userID
  const { userID } =  req.body

  // Ensure userID is specified
  if (!userID && userID !== 0) {
    res.status(400).send("Must specify userID!");
  }
  else {
    // Connect to the database
    client.connect(() => {
      // Navigate to the correct database and collection
      let database = client.db("blurp")
      let collection = database.collection("maps")

      // Find user by userID
      collection.find({ userID: userID })
        .project({mapID: 1, _id:0})
        .toArray()
        .then((ans) => {
          if(ans.length === 0)
            res.status(400).json({error: "Could not find user"})
          else 
            res.status(200).json(ans)
        })
    })
  }
});

/**
 * Create endpoint, expects a userID value and creates a new (empty) map document in MongoDB,
 * populating userID, mapID, nodes, and relationships.
 */

router.post('/create', function (req, res, next) {
<<<<<<< HEAD
    // Grab the parameters from the request body that we need, userId
    const { userID } = req.body;

    // Ensure userID is specified
  if (!userID && userID !== 0) {
    res.status(400).send("Must specify userID!");
  }
  else {
    // Connect to the database
    client.connect(() => {
      // Navigate to the correct database and collection
      let database = client.db("blurp")
      let collection = database.collection("maps")

      // Add an empty map with userID, empty node array and empty relationships array
      let nodes = []
      let relationships = []
      collection.insertOne({ userID: userID, mapID: crypto.randomUUID(), nodes: nodes, relationships: relationships})
        .then(result => {
          res.status(200).json(result)
        })
        .catch(err => {
          res.status(400).json({error: "Could not create new map"})
        })
    })
  }
=======
	// Grab the parameters from the request body that we need
	const {name} = req.body;

	// Ensure name and team are specified
	if (!name) {
		res.status(400).send("Must specify name!");
	}

	// This assumes the file already exists (and it should)
	let json = JSON.parse(fs.readFileSync(__dirname + "/../public/tempDB.json", 'utf-8'));

	// Add name and team to JSON
	json.push({name});

	// Write new changes to file
	fs.writeFile(__dirname + "/../public/tempDB.json", JSON.stringify(json), function (err) {
		if (err) {
			res.status(400).send("Issue writing file!");
		}
	});

	// Send JSON with new changes
	res.send(json);
>>>>>>> 620bdf7... Added editorconfig, reformatted code
});

/**
 * Get endpoint, expects mapID and returns all data in a map document, can be the raw JSON object.
 */

router.get("/get", function (req, res, next) {
<<<<<<< HEAD
  // Expects mapID
  const { mapID } = req.body;

  // Ensure mapID is specified
  if (!mapID && mapID !== 0) {
    res.status(400).send("Must specify mapID!");
  }
  else {
    // Connect to the database
    client.connect(() => {
      // Navigate to the correct database and collection
      let database = client.db("blurp")
      let collection = database.collection("maps")

      // Find map by mapID
      collection.find({ mapID: mapID })
        .toArray()
        .then((ans) => {
          if(ans.length === 0)
            res.status(400).json({ error: "Could not find map"})
          else
            res.status(200).json(ans)
        })
    })
  }
=======
	const {userID} = req.body;
	let inDb = JSON.parse(fs.readFileSync(__dirname + "/../public/tempDB.json", 'utf-8'));
	const found = inDb.find((inDBobj) => inDBobj.userID === userID);

	if (found) {
		const user = inDb.filter((inDBobj) => inDBobj.userID === userID);
		res.status(200).json(user);
	} else {
		res.status(404).json({message: "User not found"});
	}
>>>>>>> 620bdf7... Added editorconfig, reformatted code
});

/**
 * Update endpoint, expects userID, newUserID, and mapID. Checks to see if user is trying to update a node/relationship
 * array, resulting in a failure. Then checks if user owns the map. If user owns the map, then update userID with
 * newUserID, else failure. 
 */

router.patch("/update", function (req, res, next) {
<<<<<<< HEAD
  // Expect userID, newUserID, and mapID
  const { userID, mapID, changes } = req.body
  
  // Ensure userID, newUserID and mapID is specified
  if (!userID && userID !== 0) {
    res.status(400).send("Must specify userID!");
  }  
  else if(!changes && changes !== 0) {
    res.status(400).send("Must specify changes!");
  }
  else if(!mapID) {
    res.status(400).send("Must specify mapID!");
  }
  // Ensure newUserID is not node/relationships array
  else {
    // Connect to the database
    client.connect(() => {
      // Navigate to the correct database and collection
      let database = client.db("blurp")
      let collection = database.collection("maps")

      // Find map by MapID
      collection.find({ mapID: mapID})
        .toArray()
        .then((ans) => {
          if(ans.length === 0)
            // Couldnt find map
            res.status(400).json({ error: "Could not find map"})
          else {
            // Check if user owns the map by comparing userIDs
            let found = ans.find((inMap) => inMap.userID === userID)

            if(found) {
              // Update userID with newUserID for that map
              collection.updateOne({ mapID: mapID }, { $set: changes})
                .then(result => {
                  res.status(200).json(result)
                })
                .catch(err => {
                  res.status(400).json({error: "Could not fetch map"})
                })
            }
            else 
              res.status(400).json({error: "UserID does not own the map"})
          }
        })
    }) 
  }
=======
	const {relationshipID, update} = req.body;
	let inDB = JSON.parse(fs.readFileSync(__dirname + "/../public/tempDB.json", 'utf-8'));
	const found = inDB.findIndex((inDBobj) => inDBobj.relationshipID === relationshipID);

	if (found !== -1) {
		Object.assign(inDB[found], update);
		fs.writeFile(__dirname + "/../public/tempDB.json", JSON.stringify(inDB), function (err) {
			if (err) {
				res.status(400).send("Issue writing file!");
			}
		});
		res.status(200).json(inDB[found]);
	} else {
		res.status(404).json({mess: "relationship not found"});
	}
>>>>>>> 620bdf7... Added editorconfig, reformatted code
});

/**
 * Delete endpoint, which takes unique relationshipID from the request body.
 * Use a unique relationshipID to help increase specificity, which allows for
 * multiple removals if there are duplicates - or no removals if there are no matches.
 */
router.delete('/delete', function (req, res, next) {
<<<<<<< HEAD
  // Expects mapID and userID
  const { mapID, userID } = req.body;

  // Ensure mapID and userID is specified
  if (!mapID && mapID !== 0) {
    res.status(400).send("Must specify mapID!");
  }  
  else if(!userID && userID !== 0) {
    res.status(400).send("Must specify userID!");
  }
  else {
    // Connect to the database
    client.connect(() => {
      // Navigate to the correct database and collection
      let database = client.db("blurp")
      let collection = database.collection("maps")

      // Find map by MapID
      collection.find({ mapID: mapID})
        .toArray()
        .then((ans) => {
          if(ans.length === 0)
            // Couldnt find map
            res.status(400).json({ error: "Could not find map"})
          else {
            // Check if user owns the map by comparing userIDs
            let found = ans.find((inMap) => inMap.userID === userID)

            if(found) {
              // Delete map by mapID
              collection.deleteOne({ mapID: mapID})
                .then(result => {
                  if (result.deletedCount === 1) {
                    res.status(200).json({message: "Map deleted"})
                  }
                  else {
                    res.status(400).json({error: result})
                  }
                })
                .catch(err => {
                  res.status(400).json({error: "Could not fetch map"})
                })
            }
            else 
              res.status(400).json({error: "UserID does not own the map"})
          }
        })
    })
  }
=======
	// Grab the parameters from the request body that we need
	const {relationshipID} = req.body;

	// Ensure unique relationshipID is specified
	if (!relationshipID) {
		res.status(400).send("Must specify unique relationship ID!");
	}

	// This assumes the file already exists (and it should)
	let json = JSON.parse(fs.readFileSync(__dirname + "/../public/tempDB.json", 'utf-8'));

	// Remove relationship with matching ID. Not entirely sure if written properly.
	// This also removes duplicate instances
	json = json.filter(function (e) {
		return e.relationshipID !== relationshipID;
	});

	// Write new changes to file
	fs.writeFile(__dirname + "/../public/tempDB.json", JSON.stringify(json), function (err) {
		if (err) {
			res.status(400).send("Issue writing file!");
		}
	});
>>>>>>> 620bdf7... Added editorconfig, reformatted code
});

module.exports = router;
