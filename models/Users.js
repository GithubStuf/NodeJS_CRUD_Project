const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    name: {
        type:String,
        required: true,
    },
    email: {
        type:String,
        required: true,
        unique: true
    },
    password: {
        type:String,
        required: true,
        minLength: 6
    },
    image: {
        type: String,
        required: true,
    },
    Created: {
        type: Date,
        required: true,
        default: Date.now,
    }
});


  
module.exports = mongoose.model("User", userSchema);