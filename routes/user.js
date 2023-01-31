const express =  require('express');

// controlle functions
const { signupUser, loginUser } = require('../controllers/userController')

const routes = express.Router();

// login route
router.post('/login', loginUser)


//signup route
router.post('/signup', signupUser)


module.exports = routes