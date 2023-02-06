let express = require("express");
const fs = require("fs");
let router = express.Router();
const crypto = require("crypto");
const { client } = require("./dbhandler");
/**
 * Create endpoint, which takes two node parameters to link together, as well as relationship info.
 */
router.post("/create", function (req, res, next) {
  // Grab the parameters from the request body that we need
  const { mapID, relationshipinfo } = req.body;

  // Ensure node1, node2, and relationship are specified
  const relModel = [
    'nodeOne', 'nodeTwo', 'description', 'type', 'stress', 'familiarity'
  ]
  if (!mapID) {
    res.status(400).send("Must specify map!");
    return;
  }
  else if (!(relationshipinfo && relModel.every((i) => relationshipinfo.hasOwnProperty(i)))) {
    let responseString = "relationshipinfo must have these keys: " + relModel.join(', ');
    res.status(400).send(responseString);
    return;
  }
  //connects to the db
  client
    .connect()
    .then((response) => {
      const database = response.db("blurp");
      const collection = database.collection("maps");

      let relationshipData = {
        'relationshipID': crypto.randomUUID(),
        'nodePair': {
          'nodeOne': relationshipinfo.nodeOne,
          'nodeTwo': relationshipinfo.nodeTwo,
        },
        'description': relationshipinfo.description,
        'relationshipType': {
          'type': relationshipinfo.type,
          'stressCode': relationshipinfo.stress,
          'familiarity': relationshipinfo.familiarity
        }
      };

      console.log(relationshipData);
      console.log(mapID);

      collection
        .updateOne(
          { mapID: mapID },
          { $push: { "relationships": relationshipData}}
        )
        .then((output) => {
          console.log(output);
          if (output.modifiedCount === 1 && output.matchedCount === 1) {
            res.status(200).send({ message: "Relationship deleted"});
          }
          else if (output.matchedCount === 0) {
            res.status(400).send({ message: "Relationship not created"}); 
          }
        })
        .catch((err) => {
          res.status(400).send({ message: "Relationship was not created" });
          console.log(err);
        });
    })
    .catch((err) => {
      res.status(400).send({ message: "Database not connected" });
    });
});

/**
 * Delete endpoint, which takes the relationship id.
 */
router.delete("/delete", function (req, res, next) {
  // Grab the parameters from the request body that we need
  const { mapID, relationshipID } = req.body;

  // Ensure id is specified
  if (!mapID || !relationshipID) {
    res.status(400).send("Must specify map and relationship!");
    return;
  }
  client.connect().then((response) => {
    const database = client.db("blurp");
    const collection = database.collection("maps");
    collection.updateOne(
      { mapID: mapID, "relationships.relationshipID": relationshipID},
      { $pull: { "relationships": {"relationshipID": relationshipID}} }
    )
    .then((output) => {
      if (output.modifiedCount === 1 && output.matchedCount === 1) {
        res.status(200).send({ message: "Relationship deleted"});
      }
      else if (output.matchedCount === 0) {
        res.status(400).send({ message: "Relationship not found"});
      }
    })
    .catch((err) => {
      res.status(400).send({ message: err });
	    console.log(err);
    });
  })
  .catch((err) => {
    res.status(400).send({ message: "Database not connected" });
	  console.log(err);
  });
});

/**
 * Update endpoint, which takes the relationship id and relationship data to update.
 */
router.put("/update", function (req, res, next) {
  // Grab the parameters from the request body that we need
  const { mapID, relationshipID, changes } = req.body;

  // Ensure id is specified
  if (!mapID || !relationshipID) {
    res.status(400).send("Must specify map and relationship!");
    return;
  }


  client.connect().then((response) => {
    //const found = false;
    const database = client.db("blurp");
    const collection = database.collection("maps");
    let updates = {};
    for (const [k, v] of Object.entries(changes)) {
      updates['relationships.$[rel].' + k] = v;
    }
    collection.updateOne(
      { mapID: mapID, "relationships.relationshipID": relationshipID},
      { $set: updates },
      { arrayFilters: [
          {"rel.relationshipID": relationshipID}
      ]}
    )
    .then((output) => {
      if (output.modifiedCount === 1 && output.matchedCount === 1) {
        res.status(200).send({ message: "Relationship updated"});
      }
      else if (output.matchedCount === 0) {
        res.status(400).send({ message: "Relationship not found"});
      }
    })
    .catch((err) => {
      res.status(400).send({ message: "Database not connected" });
	  console.log(err);
    });
  // This assumes the file already exists (and it should)
  });
});

/**
 * Get endpoint, which takes a single relationship id.
 */
router.get("/get", function (req, res, next) {
  // Grab the parameters from the request body that we need
  const { mapid, relid } = req.body;

  // Ensure id is specified
  if (!mapid || !relid) {
    res.status(400).send("Must specify mapid & relid!");
    return;
  }
  client
    .connect()
    .then((response) => {
      const database = response.db("blurp");
      const collection = database.collection("maps");
		collection.aggregate([
			{ $match: {mapID: '8734873454567456to9'} },
  			{ $unwind: "$relationships" },
  			{ $match: { 'relationships.description': "Wife"}},
  			{ $project: { relationships: 1, _id:0}}	
		])
		.toArray()
		.then(output => {
			console.log(output)
			res.send(output)
		});
    })
    .catch((err) => {
      res.status(400).send({ message: "Database not connected" });
	  console.log(err);
    });
});

/**
 * Root endpoint, which sends all relationships.
 */
router.get("/", function (req, res, next) {
  const { mapid } = req.body;
  client
    .connect()
    .then((response) => {
      const database = response.db("blurp");
      const collection = database.collection("maps");

      collection.find({mapID: String(mapid)})
		.project({relationships:1, _id:0})
		.toArray(function (err, result) {
        if (err) throw err;
        res.send(result);
        //database.close();
      });
    })
    .catch((err) => {
      res.status(400).send({ message: "Database not connected" });
    });
});

module.exports = router;
