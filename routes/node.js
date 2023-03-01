let express = require("express");
let router = express.Router();
const crypto = require("crypto");
const fs = require("fs");

/* 
Using this to prevent the CORS blocked message that was popping up on front-end
https://stackoverflow.com/questions/58403651/react-component-has-been-blocked-by-cors-policy-no-access-control-allow-origin
*/
const cors = require("cors");
router.use(cors());

const { MongoClient } = require("mongodb");

// Connection URL
//const url = fs.readFileSync(__dirname + "/../mongo.db", "utf-8");
const url = process.env.MONGO_URI;
const client = new MongoClient(url);

/**
 * GET request which takes mapID and gets all nodes associated with it.
 */
router.get("/", (req, res) => {
	const { mapID } = req.body;

	if (!mapID) {
		res.status(400).send("mapID must be specified!");
		return;
	}

	client.connect((err) => {
		if (err) {
			throw err;
		}

		const db = client.db("blurp");
		const collection = db.collection("maps");

		collection
			.find({ mapID: mapID })
			.project({ nodes: 1, _id: 0 })
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
	const { mapID, nodeID } = req.body;

	if (!nodeID || !mapID) {
		res.status(400).send("nodeID and mapID must be specified!");
		return;
	}

	client.connect((err) => {
		if (err) {
			throw err;
		}

		const db = client.db("blurp");
		const collection = db.collection("maps");

		collection
			.aggregate([{ $match: { mapID: mapID } }, { $unwind: "$nodes" }, { $match: { "nodes.nodeID": nodeID } }, { $project: { nodes: 1, _id: 0 } }])
			.toArray()
			.then((output) => {
				if (output.length <= 0) {
					res.status(400).send("Node not found");
				} else {
					output = output[0].nodes;
					res.status(200).json(output);
				}
			});
	});
});

/**
 * POST request which takes userID, mapID, name, and color, and creates a new node record.
 */
router.post("/create", (req, res) => {
	const { userID, mapID, nodeinfo } = req.body;

	if (!userID || !mapID || !nodeinfo) {
		res.status(400).send("userID, mapID, nodeinfo must be specified!");
		return;
	}

	client.connect((err) => {
		if (err) {
			throw err;
		}
		const db = client.db("blurp");
		const collection = db.collection("maps");

		const newEntry = {
			nodeName: nodeinfo.nodeName,
			nodeID: nodeinfo.nodeID,
			color: nodeinfo.color,
			description: nodeinfo.description,
			pos: {
				x: nodeinfo.pos.x,
				y: nodeinfo.pos.y,
			},
			type: nodeinfo.type,
			age: nodeinfo.age,
			color: nodeinfo.color,
			groups: [],
			size: nodeinfo.size,
		};
		//collection.insertOne(newEntry)
		collection
			.updateOne({ mapID: mapID }, { $push: { nodes: newEntry } })
			.then((output) => {
				if (output.modifiedCount === 1 && output.matchedCount === 1) {
					res.status(200).send({ message: "Node created" });
				} else if (output.matchedCount === 0) {
					res.status(400).send({ message: "Node not created" });
				}
			})
			.catch((error) => {
				res.status(400).send("Invalid input.");
			});
	});
});

/**
 * DELETE request which takes a nodeID to delete and a mapID to ensure it is deleted from the correct map.
 */
router.delete("/delete", (req, res) => {
	const { mapID, nodeID } = req.body;

	if (!nodeID || !mapID) {
		res.status(400).send("nodeID and mapID must be specified!");
		return;
	}

	client.connect((err) => {
		if (err) {
			throw err;
		}

		const db = client.db("blurp");
		const collection = db.collection("maps");
		// Remove the node from map, and any relationships connected to the map
		collection
			.updateOne(
				{ mapID: mapID, "nodes.nodeID": nodeID },
				{ $pull: { nodes: { nodeID: nodeID }, relationships: { $or: [{ "nodePair.nodeOne": nodeID }, { "nodePair.nodeTwo": nodeID }] } } }
			)
			.then((output) => {
				if (output.modifiedCount === 1 && output.matchedCount === 1) {
					res.status(200).send({ message: "Node deleted" });
				} else if (output.matchedCount === 0) {
					res.status(400).send({ message: "Node not found" });
				}
			});
	});
});

/**
 * PATCH request which takes a nodeID, mapID, name, and color, where the specified nodeID will
 * be updated with the new name and color specified.
 */
router.patch("/update", (req, res) => {
	const { nodeID, mapID, changes } = req.body;

	if (!nodeID || !mapID || !changes) {
		res.status(400).send("nodeID, mapID, and changes must be specified!");
		return;
	}

	client.connect((err) => {
		if (err) {
			throw err;
		}
		const db = client.db("blurp");
		const collection = db.collection("maps");
		let updates = {};
		for (const [k, v] of Object.entries(changes)) {
			updates["nodes.$[node]." + k] = v;
		}
		collection.updateOne({ mapID: mapID, "nodes.nodeID": nodeID }, { $set: updates }, { arrayFilters: [{ "node.nodeID": nodeID }] }).then((output) => {
			if (output.modifiedCount === 1 && output.matchedCount === 1) {
				res.status(200).send({ message: "Node updated" });
			} else if (output.matchedCount === 0) {
				res.status(400).send({ message: "Node not found" });
			}
		});
	});
});

module.exports = router;
