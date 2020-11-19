"use strict";
const express = require('express');
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;

const PORT = process.env.PORT || 8080;

const app = express();app.use(cors());
app.use(express.json());
// app.use(fileUpload({
//     createParentPath: true
// }))

var URI = "mongodb://mongoUser:mongo1234@52.56.212.2/information?retryWrites=true&w=majority";
var database

MongoClient.connect(URI,{useNewUrlParser: true, useUnifiedTopology: true}, function(err, db) {
    if(err) throw err;
    else{
        console.log("db connection successful");
    }

    database = db.db("information");
});

//Retrieve all users
app.get('/info', (req, res) => {
    database.collection("personalInfo").find({}).toArray(function(err, result){
        if(err) throw err;
        res.send(result);
    });
})

app.post('/newInfo', (req, res) =>{

    /*const newUser = {
        firstName:req.body.firstName,
        lastName:req.body.lastName,
        email:req.body.email,
        phoneNumber:req.body.phoneNumber,
        address:req.body.address
    }*/

    database.collection("personalInfo").insert(req.body.newInfo, function(err){
        if(err){
            console.log(err);
        }else{
            res.send("User added")
        }
    })

})


module.exports = app;