const express =  require('express');

const router = express.Router();

// get a single user
router.get('/:id', (req,res) => {
    res.json({mssg: "GET a single user"});
})

// POST a user
router.post('/', (req,res) => {
    res.json({mssg: "POST a user"});
});

// DELETE a user
router.delete('/:id', (req,res) => {
    res.json({mssg: "DELETE a user"});
});

// Update a user
router.patch('/:id', (req,res) => {
    res.json({mssg: "Update a user"});
});



module.exports = router