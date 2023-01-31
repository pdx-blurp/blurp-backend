const mongoose = require('mongoose')
const Schema = mongoose.Schema
const bcrypt = require('bcrypt')

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    username: {
        type : String,
        required: true
    },
    password:{
        type: String,
        required: true
    }
})


// static signup methods
userSchema.statics.signup = async function(email, username, passowd) {

    const exists = await this.findOne({ email })
    if (exists) {
        throw Error('Email already exists')
    }

    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(passowd, salt)

    const user = await this.create({ email, username, passowd: hash })

    return user

}

module.exports = mongoose.model('User', userSchema)