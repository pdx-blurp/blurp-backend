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
});

/**
 * Get endpoint, expects mapID and returns all data in a map document, can be the raw JSON object.
 */

router.get("/get", function (req, res, next) {
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
});

/**
 * Update endpoint, expects userID, newUserID, and mapID. Checks to see if user is trying to update a node/relationship
 * array, resulting in a failure. Then checks if user owns the map. If user owns the map, then update userID with
 * newUserID, else failure. 
 */

router.patch("/update", function (req, res, next) {
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
});

/**
 * Delete endpoint, expects a mapID and userID. then check if the user owns the map. If user owns the
 * map, then drop the document from the database, else failure.
 */
router.delete('/delete', function (req, res, next) {
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
});

// Returns all the nodes in the map
router.get("/node", (req, res) => {
  res.send([
    { nodeID: 1, userID: 1, mapID: 1, name: "Dalia", color: "Red" },
    { nodeID: 2, userID: 1, mapID: 1, name: "Lili", color: "Green" },
    { nodeID: 1, userID: 2, mapID: 2, name: "Dalia", color: "Red" },
    { nodeID: 2, userID: 2, mapID: 2, name: "Lili", color: "Green" },
  ]);
});

router.get("/node/get", (req, res) => {
  const { userID } = req.body;
  const nodeArr = [
    { nodeID: 1, userID: 1, mapID: 1, name: "Dalia", color: "Red" },
    { nodeID: 2, userID: 1, mapID: 1, name: "Lili", color: "Green" },
    { nodeID: 1, userID: 2, mapID: 2, name: "Dalia", color: "Red" },
    { nodeID: 2, userID: 2, mapID: 2, name: "Lili", color: "Green" },
  ];
  const found = nodeArr.find((node) => node.userID === userID);
  if (found) {
    const singleNode = nodeArr.filter((node) => node.userID === userID);
    res.status(200).json(singleNode);
  } else {
    res.status(404).json({ message: "Node not found" });
  }
});

router.post("/node/create", (req, res) => {
  const { userID, mapID, name, color } = req.body;
  const nodeArr = [
    { nodeID: 1, userID: 1, mapID: 1, name: "Dalia", color: "Red" },
    { nodeID: 2, userID: 1, mapID: 1, name: "Lili", color: "Green" },
    { nodeID: 1, userID: 2, mapID: 2, name: "Dalia", color: "Red" },
    { nodeID: 2, userID: 2, mapID: 2, name: "Lili", color: "Green" },
  ];

  nodeArr.push({ nodeID: 3, userID, mapID, name, color });
  res.send(nodeArr);
});

router.delete("/node/delete", (req, res) => {
  const { userID, mapID, nodeID } = req.body;
  const nodeArr = [
    { nodeID: 1, userID: 1, mapID: 1, name: "Dalia", color: "Red" },
    { nodeID: 2, userID: 1, mapID: 1, name: "Lili", color: "Green" },
    { nodeID: 1, userID: 2, mapID: 2, name: "Dalia", color: "Red" },
    { nodeID: 2, userID: 2, mapID: 2, name: "Lili", color: "Green" },
  ];

  const found = false;
  nodeArr.forEach((element, index) => {
    if (
      (element.nodeID === nodeID && element.userID === userID,
      element.mapID === mapID)
    ) {
      nodeArr.splice(index, 1);
      found = true;
    }
  });
  if (found) {
    res.status(200).json(nodeArr);
  } else {
    res.status(400).json({ message: "Node not found" });
  }
});

router.patch("/node/update", (req, res) => {
  const { userID, mapID, nodeID, name, color } = req.body;
  const nodeArr = [
    { nodeID: 1, userID: 1, mapID: 1, name: "Dalia", color: "Red" },
    { nodeID: 2, userID: 1, mapID: 1, name: "Lili", color: "Green" },
    { nodeID: 1, userID: 2, mapID: 2, name: "Dalia", color: "Red" },
    { nodeID: 2, userID: 2, mapID: 2, name: "Lili", color: "Green" },
  ];

  nodeArr.forEach((element, index) => {
    if (
      (element.nodeID === nodeID && element.userID === userID,
      element.mapID === mapID)
    ) {
      nodeArr[index].name = name;
      nodeArr[index].color = color;
    }
  });
  if (found) {
    res.status(200).json(nodeArr);
  } else {
    res.status(400).json({ message: "Node not found" });
  }
});

module.exports = router;
