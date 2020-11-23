const express = require('express');
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
const app = express();
const fileUpload = require('express-fileupload');
const jwt = require('jsonwebtoken');
var URI = "mongodb://mongoUser:mongo1234@52.56.212.2/information?retryWrites=true&w=majority";
const util = require('util');
const bcrypt = require('bcrypt');

MongoClient.connect(URI,{useNewUrlParser: true, useUnifiedTopology: true}, function(err, db) {
    if(err) throw err;
    else{
        console.log("db connection successful");
    }

    database = db.db("information");
});

// enable fileUpload
app.use(fileUpload());
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cors());
app.use(function (req, res, next) {
    //Enabling CORS
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-client-key, x-client-token, x-client-secret, Authorization"),
    next()
    });

// upload file to API, extract JSON values and insert in collection
app.post('/uploadFile', async(req, res)=>{
    
    try{
        
    const file = req.files.file;
    const filename = file.name;
    console.log(file.name)
    console.log(file.data.toString())
    const URL = "/"+filename;

    util.promisify(file.mv)('./uploads' +URL)
    res.status(200).json({
        message: 'File recieved and stored at API',   
    })

    info =  JSON.parse(file.data.toString())
    person={
        firstName: info.firstName,
        lastName: info.lastName,
        email: info.email,
        phoneNumber: info.phoneNumber,
        address: info.address
    }
    
    database.collection("personalInfo").insertOne(person);
    console.log('successfully added to MongoDB')

    }catch(err){
        console.log(err);
        res.status(500).json({
            message: 'Unsuccessful, JSON expected'
        })
    }

})

//Retrieve all db entries
app.get('/info', (req, res) => {
    database.collection("personalInfo").find({}).toArray(function(err, result){
        if(err) throw err;
        res.send(result);
    });
})

//Retrieve all users
app.get('/login', (req, res) => {
    database.collection("users").find({}).toArray(function(err, result){
        if(err) throw err;
        res.send(result);
    });
})

//sign new user up to database
app.post('/signUp',/*  validate, */async(req, res)=>{
    // jwt.verify(req.token, 'key',(err, authData)=>{
    //     if(err){
    //         res.sendStatus(403)
    //     }else{
            try{
                const salt = await bcrypt.genSalt();
                const pwHash = await bcrypt.hash(req.body.password, salt);
                const user={
                    username: req.body.username,
                    password: pwHash
                }
        
                database.collection('users').insertOne(user, function(err) {
                    if(err) throw error;
                    console.log("message: 'user added to users collection'");;
                    res.sendStatus(200).json({
                        message: 'user added to users collection'
                    })
                });
                console.log('user inserted');
                jwt.sign({user}, 'key',{expiresIn: '10m'}, (err, token) =>{
                    res.sendStatus(200).json({
                        token
                    })
                });
            }catch{
                res.sendStatus(201).json({
                    message: 'Error'
                })
            }
        // }
    // })
})


module.exports = app;



/* 
app.post('/login', async(req, res) =>{
    const user = {
        username: req.body.username,
        password: req.body.password
    }
    console.log(user.username);
    if(database.collection("users").findOne({username: user.username})){
        
    }else{
        res.send('no match')
    }
})
 */