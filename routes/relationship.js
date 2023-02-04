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
  const { node1, node2, relationship } = req.body;

  // Ensure node1, node2, and relationship are specified
  if (!node1 || !node2 || !relationship) {
    res.status(400).send("Must specify node1, node2, and relationship!");
  }
  //connects to the db
  client
    .connect()
    .then((response) => {
      const database = response.db("newMongoDB");
      const collection = database.collection("relationships");

      collection
        .insertOne({ node1: node1, node2: node2, relationship: relationship })
        .then((doc) => {
          res.status(200).send(doc);
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
  const { id } = req.body;

  // Ensure id is specified
  if (!id) {
    res.status(400).send("Must specify id!");
    return;
  }
  /*
  var id = new require("mongodb").ObjectID(id); //req.params.id
  db.collection("users")
    .findOne({ _id: id })
    .then(function (doc) {
      if (!doc) throw new Error("No record found.");
      console.log(doc); //else case
    });
*/

  const database = client.db("newMongoDB");
  const collection = database.collection("relationships");
  client.connect().then((response) => {
    const found = false;
    //compares id to document id's
    collection
      .findById({ id })
      .then((doc) => {
        console.log(doc);
      })
      .catch((err) => {
        console.log(err);
      });
  });

  /*
  // This assumes the file already exists (and it should)
  let json = JSON.parse(
    fs.readFileSync(__dirname + "/../public/relationships.json", "utf-8")
  );

  // Remove by id from json
  // This also removes duplicate instances
  json = json.filter(function (e) {
    return e.id !== id;
  });

  // Write new changes to file
  fs.writeFile(
    __dirname + "/../public/relationships.json",
    JSON.stringify(json),
    function (err) {
      if (err) {
        res.status(400).send("Issue writing file!");
      }
    }
  );

  // Send JSON with new changes
  res.send(json);
  */
});

/**
 * Update endpoint, which takes the relationship id and relationship data to update.
 */
router.put("/update", function (req, res, next) {
  // Grab the parameters from the request body that we need
  const { id, relationship } = req.body;

  // Ensure id is specified
  if (!id || !relationship) {
    res.status(400).send("Must specify id and relationship!");
    return;
  }

  const database = client.db("newMongoDB");
  const collection = database.collection("relationships");
  client.connect().then((response) => {
    const found = false;
  // This assumes the file already exists (and it should)
  });
/*
  let json = JSON.parse(
    fs.readFileSync(__dirname + "/../public/relationships.json", "utf-8")
  );

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
  json.push({ id, node1, node2, relationship });

  // Write new changes to file
  fs.writeFile(
    __dirname + "/../public/relationships.json",
    JSON.stringify(json),
    function (err) {
      if (err) {
        res.status(400).send("Issue writing file!");
      }
    }
  );

  // Send JSON with new changes
  res.send(json);
*/
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
/*
      collection.find({mapID: String(mapid), "relationships": {$elemMatch:  {relationshipID: 1}}})
		.project({relationships:1, _id:0})
		.toArray(function (err, result) {
        if (err) throw err;
        res.send(result);
        //database.close();
      });
*/
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
/*
  // This assumes the file already exists (and it should)
  let json = JSON.parse(
    fs.readFileSync(__dirname + "/../public/relationships.json", "utf-8")
  );

  // Grab the record to update
  let matchedRecord = json.filter(function (e) {
    return e.id === id;
  })[0];

  // Send matched JSON
  res.send(matchedRecord);
*/
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
