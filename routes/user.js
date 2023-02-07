const express =  require('express');

// controlle functions
const { signupUser, loginUser } = require('../controllers/userController')

const router = express.Router();

// login route
router.post('/login', loginUser)

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

//signup route
router.post('/signup', signupUser)


module.exports = router