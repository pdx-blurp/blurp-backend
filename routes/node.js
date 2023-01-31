let express = require("express");
let router = express.Router();
const crypto = require('crypto');

const {MongoClient} = require("mongodb");

// Connection URL
const url = "mongodb+srv://Blurp:Pdxgroupproject1!@cluster0.fxl2nvt.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(url);

/**
 * GET request which takes mapID and gets all nodes associated with it.
 */
router.get("/", (req, res) => {
	const {mapID} = req.body;

	if (!mapID) {
		res.status(400).send("mapID must be specified!");
		return;
	}

	client.connect(err => {
		if (err) {
			throw err;
		}

		const db = client.db("blurp");
		const collection = db.collection("nodes");

		collection.find({mapID: mapID})
			.toArray()
			.then((result) => {
				res.status(200).json(result);
			});
	});
});

/**
 * GET request which takes a nodeID and returns its data.
 */
router.get("/get", (req, res) => {
	const {nodeID} = req.body;

	if (!nodeID) {
		res.status(400).send("nodeID must be specified!");
		return;
	}

	client.connect(err => {
		if (err) {
			throw err;
		}

		const db = client.db("blurp");
		const collection = db.collection("nodes");

		collection.find({nodeId: nodeID})
			.toArray()
			.then((result) => {
				if (result.length !== 1) {
					res.status(400).send("Could not find single node by id specified!")
					return;
				}
				res.status(200).json(result);
			});
	});
});

/**
 * POST request which takes userID, mapID, name, and color, and creates a new node record.
 */
router.post("/create", (req, res) => {
	const {userID, mapID, name, color} = req.body;

	if (!userID || !mapID || !name || !color) {
		res.status(400).send("userID, mapID, name, and color must be specified!")
		return;
	}

	client.connect(err => {
		if (err) {
			throw err;
		}

		const db = client.db("blurp");
		const collection = db.collection("nodes");

		const newEntry = {userId: userID, mapId: mapID, name: name, nodeId: crypto.randomUUID(), color: color};
		collection.insertOne(newEntry)
			.then(result => {
				res.status(200).json(result);
			})
			.catch(error => {
				res.status(400).send("Invalid input.")
			})
	});
});

/**
 * DELETE request which takes a nodeID to delete and a mapID to ensure it is deleted from the correct map.
 */
router.delete("/delete", (req, res) => {
	const {mapID, nodeID} = req.body;

	if (!nodeID || !mapID) {
		res.status(400).send("nodeID and mapID must be specified!");
		return;
	}

	client.connect(err => {
		if (err) {
			throw err;
		}

		const db = client.db("blurp");
		const collection = db.collection("nodes");

		collection.deleteOne({nodeId: nodeID, mapId: mapID})
			.then((result) => {
				if (result.deletedCount !== 1) {
					res.status(400).send("Could not find single node by id specified to delete!")
					return;
				}
				res.status(200).json(result);
			});
	});
});

/**
 * PATCH request which takes a nodeID, mapID, name, and color, where the specified nodeID will
 * be updated with the new name and color specified.
 */
router.patch("/update", (req, res) => {
	const {nodeID, mapID, name, color} = req.body;

	if (!nodeID || !mapID || !name || !color) {
		res.status(400).send("nodeID, mapID, name, and color must be specified!");
		return;
	}

	client.connect(err => {
		if (err) {
			throw err;
		}

		const db = client.db("blurp");
		const collection = db.collection("nodes");

		collection.updateOne({nodeId: nodeID, mapId: mapID}, {$set: {name: name, color: color}})
			.then((result) => {
				if (result.modifiedCount !== 1) {
					res.status(400).send("No nodes modified!")
					return;
				}
				res.status(200).json(result);
			});
	});
});

module.exports = router;