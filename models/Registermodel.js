const mongoose = require('mongoose');
var validator = require("validator");

const registerSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        index: {
            unique: true,
        },
        validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Please enter a valid E-mail!");
        }
      },
    },
    phone: { 
    	type:Number,
        required: true
    },
    address: { 
    	type:String,
        required: true
    },
    password: { 
    	type:String,
        required: true
    },
    userPhoto: { 
    	type:String,
        required: true
    },
    updateAt: {
        type: Date,
        default: Date.now,

    },
    createAt: {
        type: Date,
        default: Date.now,

    }
});

const register = mongoose.model('users', registerSchema);

module.exports = register;
