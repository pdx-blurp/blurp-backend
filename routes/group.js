let express = require("express");
let router = express.Router();
const crypto = require("crypto");
const { client } = require("./dbhandler")

router.get('/', function (req, res, next) {
	const {mapID} = req.body;

	if (!mapID) {
		res.status(400).send("mapID must be specified!");
		return;
	}

    client
    .connect()
    .then((response) => {
      const database = response.db("blurp");
      const collection = database.collection("maps");

      collection.find({mapID: mapID})
      .project({groups: 1, _id: 0})
      .toArray()
      .then((output) => {
        res.status(200).json(output[0].groups);
      })
    })
    .catch((err) => {
        res.status(400).send({ message: "Database not connected" })
    })
});

router.get('/get', function (req, res, next) {
    const {mapID, groupID} = req.body;

	if (!mapID || !groupID) {
		res.status(400).send("mapID and groupID must be specified!");
		return;
	}
    client
    .connect()
    .then((response) => {
      const database = response.db("blurp");
      const collection = database.collection("maps");
		collection.aggregate([
			{ $match: {mapID: mapID} },
  			{ $unwind: "$groups" },
  			{ $match: { 'groups.groupID': groupID}},
  			{ $project: { groups: 1, _id:0}}	
		])
		.toArray()
		.then(output => {
            output = output[0].groups;
			console.log(output)
			res.send(output)
		});
    })
    .catch((err) => {
      res.status(400).send({ message: "Database not connected" });
	  console.log(err);
    });
});


router.post('/create', function (req, res, next) {
    const { mapID, groupinfo } = req.body;

  // Ensure node1, node2, and group are specified
  const grpModel = [
    'groupName', 'description'
  ]
  if (!mapID) {
    res.status(400).send("Must specify mapID!");
    return;
  }
  else if (!(groupinfo && grpModel.every((i) => groupinfo.hasOwnProperty(i)))) {
    let responseString = "groupinfo must have these keys: " + grpModel.join(', ');
    res.status(400).send(responseString);
    return;
  }
  //connects to the db
  client
    .connect()
    .then((response) => {
      const database = response.db("blurp");
      const collection = database.collection("maps");
      // TODO: check that two nodes actually exist

      let groupData = {
        'groupName': groupinfo.groupName,
        'groupID': crypto.randomUUID(),
        'description': groupinfo.description
      };

      collection
        .updateOne(
          { mapID: mapID },
          { $push: { "groups": groupData}}
        )
        .then((output) => {
          if (output.modifiedCount === 1 && output.matchedCount === 1) {
            res.status(200).send({ message: "Group created"});
          }
          else if (output.matchedCount === 0) {
            res.status(400).send({ message: "Group not created"}); 
          }
        })
        .catch((err) => {
          res.status(400).send({ message: "Group was not created" });
          console.log(err);
        });
    })
    .catch((err) => {
      res.status(400).send({ message: "Database not connected" });
    });
});

router.patch("/update", function (req, res, next) {
  // Grab the parameters from the request body that we need
  const { mapID, groupID, changes } = req.body;

  // Ensure id is specified
  if (!mapID || !groupID || !changes) {
    res.status(400).send("Must specify mapID & groupID & changes!");
    return;
  }


  client.connect().then((response) => {
    //const found = false;
    const database = client.db("blurp");
    const collection = database.collection("maps");
    let updates = {};
    for (const [k, v] of Object.entries(changes)) {
      updates['groups.$[grp].' + k] = v;
    }
    collection.updateOne(
      { mapID: mapID, "groups.groupID": groupID},
      { $set: updates },
      { arrayFilters: [
          {"grp.groupID": groupID}
      ]}
    )
    .then((output) => {
      if (output.modifiedCount === 1 && output.matchedCount === 1) {
        res.status(200).send({ message: "Group updated"});
      }
      else if (output.matchedCount === 0) {
        res.status(400).send({ message: "Group not found"});
      }
    })
    .catch((err) => {
      res.status(400).send({ message: "Database not connected" });
	  console.log(err);
    });
  });
});

router.delete('/delete', function (req, res, next) {
    const { mapID, groupID } = req.body;

  // Ensure id is specified
  if (!mapID || !groupID) {
    res.status(400).send("Must specify mapID and groupID!");
    return;
  }
  client.connect().then((response) => {
    const database = client.db("blurp");
    const collection = database.collection("maps");
    collection.updateOne(
      { mapID: mapID, "groups.groupID": groupID},
      { $pull: { "groups": {"groupID": groupID}, "nodes.$[].groups": groupID} }
    )
    .then((output) => {
      if (output.modifiedCount === 1 && output.matchedCount === 1) {
        res.status(200).send({ message: "Group deleted"});
      }
      else if (output.matchedCount === 0) {
        res.status(400).send({ message: "Group not found"});
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

module.exports = router;