const mongoose = require('mongoose');

//Schema
const infoSchema = mongoose.Schema({
    firstName:{
        type: String,
        required: true
    },
    lastName:{
        type: String,
        required: true
    },
    email:{
        type: String
    },
    phoneNumber:{
        type: Number
    },
    address:{
        type: Array
    }

})


//model
var Info = module.exports =mongoose.model('Info', infoSchema)

// GET Info
module.exports.getInfo= function(callback, limit){
    Info.find(callback).limit(limit);
}