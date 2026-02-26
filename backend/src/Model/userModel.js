// User model

const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    firstName : String,
    lastName : String,
    email : String,
    password : String,
    contactNo : Number,
    gender : {
        type : String,
        enum:  ['Male', 'Female'] 
    },

})

const userModel = mongoose.model('user', userSchema);

module.exports= userModel;











