const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { db } = require('../../models/info');

const Info = require('../../models/info');

router.get('/', (req, res, next)=>{
    res.status(200).json({
        message: "GET request handled"
    });
});

router.get('/:personId', (req, res, next)=>{
    const id = req.params.personId;
    if (id === 'none'){
        res.status(200).json({
            message: "person with id " +id,
            id: id
        });
    }else{
        res.status(200).json({
            message: "you passed an ID"
        })
    }
})
/* router.post('/', async(req, res)=>{
    let info = {};
    info.firstName = firstName;
    info.lastName = lastName;
    let information = new Info(info);
    information.save();
    await information;
    res.status(200).json({
        information,
        message: "fucking success"
    })
}) */

router.post('/', (req, res, next)=>{
        const info= new Info({
        _id: new mongoose.Types.ObjectId,
        firstName: req.body.firstname,
        lastName: req.body.password
    });

    Info.save().then(result =>{
        console.log(result);
    }).catch(err => console.log(err));

    res.status(201).json({
        message: 'POST request handled',
        createdInfo: info
    });
});

/* router.post('/new', async (req, res)=>{
    try{
        const salt =await bcrypt.genSalt();
        const hashedPW = await bcrypt.hash(req.body.password, salt);
        const user={
            username: req.body.username,
            password: hashedPW
        }
        db.collection("users").insertOne(user, function(err){
            if(err) throw error;
            console.log('Document inserted successfully');
            res.status(200).send('User added successfully');
        })
    }
    catch{
        res.status(201).send("Something went wrong")
        console.log(res);
    }
});
 */
router.delete('/:personId', (req, res, next)=>{
    const id = req.params.personId;
    res.status(200).json({
        message: id +" deleted"
    })
})
module.exports =router;