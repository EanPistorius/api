const jwt = require('jsonwebtoken');



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

jwt.verify(req.token, 'key',(err, authData)=>{
    if(err){
        res.sendStatus(403)
    }else{
        
    }
})
const authJWT={
    verifyToken
}
module.exports =authJWT;