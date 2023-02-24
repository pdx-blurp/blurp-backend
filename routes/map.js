let express = require("express");
const fs = require("fs");
let router = express.Router();
const crypto = require("crypto");
const { client } = require("./dbhandler");

/* 
Using this to prevent the CORS blocked message that was popping up on front-end
https://stackoverflow.com/questions/58403651/react-component-has-been-blocked-by-cors-policy-no-access-control-allow-origin
*/
const cors = require("cors");
router.use(cors());

/**
 * Root map endpoint, expects a userID value and returns a list of objects that contain userName
 * and mapID that the userID owns.
 */

router.get("/", (req, res, next) => {
	// Expects userID
	const { userID } = req.body;

	// Ensure userID is specified
	if (!userID && userID !== 0) {
		res.status(400).send("Must specify userID!");
	} else {
		// Connect to the database
		client.connect(() => {
			// Navigate to the correct database and collection
			let database = client.db("blurp");
			let collection = database.collection("maps");

			// Find user by userID
			collection
				.find({ userID: userID })
				.project({ _id: 0 })
				.toArray()
				.then((ans) => {
					if (ans.length === 0) res.status(400).json({ error: "Could not find user" });
					else res.status(200).json(ans);
				});
		});
	}
});

/**
 * Create endpoint, expects a userID value and creates a new (empty) map document in MongoDB,
 * populating userID, mapID, nodes, and relationships.
 */

router.post("/create", function (req, res, next) {
	// Grab the parameters from the request body that we need, userId
	const { userID } = req.body;

	// Ensure userID is specified
	if (!userID && userID !== 0) {
		res.status(400).send("Must specify userID!");
	} else {
		// Connect to the database
		client.connect(() => {
			// Navigate to the correct database and collection
			let database = client.db("blurp");
			let collection = database.collection("maps");
			// Add an empty map with userID, empty node array and empty relationships array
			let nodes = [];
			let relationships = [];
			let groups = [];
			collection
				.insertOne({ userID: userID, mapID: crypto.randomUUID(), nodes: nodes, relationships: relationships, groups: groups })
				.then((result) => {
					res.status(200).json(result);
				})
				.catch((err) => {
					res.status(400).json({ error: "Could not create new map" });
				});
		});
	}
});

/**
 * Get endpoint, expects mapID and returns all data in a map document, can be the raw JSON object.
 */

router.post("/get", function (req, res, next) {
	// Expects mapID
	const { mapID } = req.body;

	// Ensure mapID is specified
	if (!mapID && mapID == 0) {
		res.status(400).send("Must specify mapID!");
	} else {
		// Connect to the database
		client.connect(() => {
			// Navigate to the correct database and collection
			let database = client.db("blurp");
			let collection = database.collection("maps");

			// Find map by mapID
			collection
				.find({ mapID: mapID })
				.toArray()
				.then((ans) => {
					if (ans.length === 0) res.status(400).json({ error: "Could not find map" });
					else res.status(200).json(ans);
				});
		});
	}
});

/**
 * Update endpoint, expects userID, newUserID, and mapID. Checks to see if user is trying to update a node/relationship
 * array, resulting in a failure. Then checks if user owns the map. If user owns the map, then update userID with
 * newUserID, else failure.
 */

router.patch("/update", function (req, res, next) {
	// Expect userID, newUserID, and mapID
	const { userID, mapID, changes } = req.body;

	// Ensure userID, newUserID and mapID is specified
	if (!userID && userID !== 0) {
		res.status(400).send("Must specify userID!");
	} else if (!changes && changes !== 0) {
		res.status(400).send("Must specify changes!");
	} else if (!mapID) {
		res.status(400).send("Must specify mapID!");
	}
	// Ensure newUserID is not node/relationships array
	else {
		// Connect to the database
		client.connect(() => {
			// Navigate to the correct database and collection
			let database = client.db("blurp");
			let collection = database.collection("maps");

			// Find map by MapID
			collection
				.find({ mapID: mapID })
				.toArray()
				.then((ans) => {
					if (ans.length === 0)
						// Couldnt find map
						res.status(400).json({ error: "Could not find map" });
					else {
						// Check if user owns the map by comparing userIDs
						let found = ans.find((inMap) => inMap.userID === userID);

						if (found) {
							// Update userID with newUserID for that map
							collection
								.updateOne({ mapID: mapID }, { $set: changes })
								.then((result) => {
									res.status(200).json(result);
								})
								.catch((err) => {
									res.status(400).json({ error: "Could not fetch map" });
								});
						} else res.status(400).json({ error: "UserID does not own the map" });
					}
				});
		});
	}
});

/**
 * Delete endpoint, which takes unique relationshipID from the request body.
 * Use a unique relationshipID to help increase specificity, which allows for
 * multiple removals if there are duplicates - or no removals if there are no matches.
 */
router.delete("/delete", function (req, res, next) {
	// Expects mapID and userID
	const { mapID, userID } = req.body;

	// Ensure mapID and userID is specified
	if (!mapID && mapID !== 0) {
		res.status(400).send("Must specify mapID!");
	} else if (!userID && userID !== 0) {
		res.status(400).send("Must specify userID!");
	} else {
		// Connect to the database
		client.connect(() => {
			// Navigate to the correct database and collection
			let database = client.db("blurp");
			let collection = database.collection("maps");

			// Find map by MapID
			collection
				.find({ mapID: mapID })
				.toArray()
				.then((ans) => {
					if (ans.length === 0)
						// Couldnt find map
						res.status(400).json({ error: "Could not find map" });
					else {
						// Check if user owns the map by comparing userIDs
						let found = ans.find((inMap) => inMap.userID === userID);

						if (found) {
							// Delete map by mapID
							collection
								.deleteOne({ mapID: mapID })
								.then((result) => {
									if (result.deletedCount === 1) {
										res.status(200).json({ message: "Map deleted" });
									} else {
										res.status(400).json({ error: result });
									}
								})
								.catch((err) => {
									res.status(400).json({ error: "Could not fetch map" });
								});
						} else res.status(400).json({ error: "UserID does not own the map" });
					}
				});
		});
	}
});

module.exports = router;
