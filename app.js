const express = require('express');
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
const app = express();
const fileUpload = require('express-fileupload');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const _ = require('lodash');
const jwt = require('jsonwebtoken');

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

// app.post('/newInfo', (req, res) =>{

//     /*const newUser = {
//         firstName:req.body.firstName,
//         lastName:req.body.lastName,
//         email:req.body.email,
//         phoneNumber:req.body.phoneNumber,
//         address:req.body.address
//     }*/

//     database.collection("personalInfo").insert(req.body.newInfo, function(err){
//         if(err){
//             console.log(err);
//         }else{
//             res.send("Data added")
//         }
//     })

// })

// enable fileUpload
app.use(fileUpload({
    createParentPath: true
}));

//middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(morgan('dev'));
app.use(function (req, res, next) {
    //Enabling CORS
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-client-key, x-client-token, x-client-secret, Authorization"),
    next()
    });


app.post('/newInfo', verifyToken, async (req, res) => {
    jwt.verify(req.token, 'key',(err, authData)=>{
        if(err){
            res.sendStatus(403)
        }else{
            try {
                if(!req.files) {
                    res.send({
                        status: false,
                        message: 'No file uploaded',
                        authData
                    });
                } else {
                    //Use the name of the input field (i.e. "avatar") to retrieve the uploaded file
                    let newInfo = req.files.file;
                    
                    //Use the mv() method to place the file in upload directory (i.e. "uploads")
                    // newInfo.mv('./uploads/' + newInfo.name);
                    database.collection("personalInfo").insert(newInfo, function(err){
                        if(err){
                            console.log(err);
                        }else{
                            res.send("Data added")
                        }
                    })
                    //send response
                    res.send({
                        status: true,
                        message: 'File is uploaded',
                        data: {
                            name: newInfo.name,
                            mimetype: newInfo.mimetype,
                            size: newInfo.size
                        },
                        authData
                    });
                }
            } catch (err) {
                res.status(500).send(err);
            }
        }
    })
    
});

app.post('/api/login', async(req, res) =>{
    //user
    const user = {
        id: 1,
        username: 'ean',
        password: '1234'
    }
    jwt.sign({user}, 'key',{expiresIn: '10m'}, (err, token) =>{
        res.json({
            token
        })
    });
})

//format:
//Authorization: Bearer <access_token>

//Verify JSON web token
function verifyToken(req, res, next){
    //GET auth header value
    const bearerHeader = req.headers['authorization'];
    //check is bearer is undefined
    if(typeof bearerHeader !== 'undefined'){
        //split at space
        const bearer = bearerHeader.split(' ');
        //get token from array
        const bearerToken = bearer[1];
        //set token
        req.token = bearerToken;
        next();
    }else{
        res.sendStatus(403);
        console.log('undefined token')
    }
}

module.exports = app;