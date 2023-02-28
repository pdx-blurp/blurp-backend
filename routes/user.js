const express =  require('express');
const crypto = require("crypto");
const { client } = require("./dbhandler");
const router = express.Router();
const fs = require("fs");

// get a single user
router.get('/getUser', (req,res) => {
    client
    .connect()
    .then((response) => {
        const database = response.db("blurp");
        const collection = database.collection("users");
        collection.find({ userID: userID })
        
        collection.find({ mapID: mapID })
        .toArray()
        .then((ans) => {
            if(ans.length === 0)
            res.status(400).json({ error: "Could not find user"})
            else
            res.status(200).json(ans)
        })
    })
});




// POST a user
router.post('/notSureWeNeedThis', (req,res) => {
    client
    .connect()
    .then((response) => {
        const database = response.db("blurp");
        const collection = database.collection("users");
    });
    res.json({mssg: "POST a user"});
});

// DELETE a user
router.delete('/deleteUser', (req,res) => {
    // expects userID
    const { userID } = req.body;
    client
    .connect()
    .then((response) => {
        const database = response.db("blurp");
        const collection = database.collection("users");

    collection.find({ userID: userID})
    .then((ans) => {
        if(ans.length === 0)
          // Couldnt find user
        res.status(400).json({ error: "Could not find user"})
        else {

        let found = ans.find((inMap) => inMap.userID === userID)

        if(found) {
            // Delete user by userid
            collection.deleteOne({ userID: userID})
            .then(result => {
                if (result.deletedCount === 1) {
                res.status(200).json({message: "user deleted"})
                }
                else {
                res.status(400).json({error: result})
                }
            })
            .catch(err => {
                res.status(400).json({error: "Could not fetch user"})
            })
        }
        else 
            res.status(400).json({error: "UserID does not exist"})
        }
    })

    })
    res.json({mssg: "DELETE a user"});
});

// Update a user
router.patch('/updateUser', (req,res) => {
    const {userID, changes} = req.body;

    client
    .connect()
    .then((response) => {
        const database = response.db("blurp");
        const collection = database.collection("users");
        // find user by userID
        collection.find({ userID: userID})
        .then((ans) => {
            if(ans.length === 0)
              // Couldnt find map
                res.status(400).json({ error: "Could not find map"})
            else {
                let found = ans.find((inMap) => inMap.userID === userID)

            if(found) {
                // Update userID with newUserID for that map
                collection.updateOne({ userID: userID }, { $set: changes})
                    .then(result => {
                    res.status(200).json(result)
                })
                .catch(err => {
                    res.status(400).json({error: "Could not fetch users"})
                })
            }
            else 
                res.status(400).json({error: "UserID does not exist"})
            }
    })
})

    res.json({mssg: "Update a user"});
});



module.exports = router;