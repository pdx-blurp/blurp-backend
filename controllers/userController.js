const User = require('../models/userModel')

// login user
const loginUser = (req, res) => {
    res.json({mesg: 'login user'});
}


// signup user
const signupUser = async (req, res) => {
    const {email, username, password} = req.body

    try {
        const user = await User.signup(email, username, password)
        res.status(200).json({email, user})
    }catch (error) {
        res.status(500).json({error: error.message})
    }
}

module.exports = { signupUser, loginUser }