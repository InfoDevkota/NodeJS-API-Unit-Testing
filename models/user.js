const mongoose = require('mongoose');

const Schema = mongoose.Schema;

let userSchema = new Schema({
    firstName: {
        type: String
    },
    lastName: {
        type: String
    },
    country: {
        type: String
    },
    email: {
        type: String
    },
    dateOfBirth: {
        type: Date
    },
    password:{
        type: String
    }

}, {
    timestamps: true
})

module.exports = mongoose.model('User', userSchema);