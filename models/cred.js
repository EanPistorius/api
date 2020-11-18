const mongoose = require('mongoose');

const credSchema = mongoose.Schema({
    username:{
        type: String,
        required: true
    },
    password:{
        type: String,
        required:true
    }
})

const Cred = mongoose.model('Cred', credSchema);

module.exports.getCredentials = function(callback, limit){
    Cred.find(callback).limit(limit);
}