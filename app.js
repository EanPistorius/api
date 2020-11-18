const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const GridFsStorage = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');
const morgan = require('morgan');
const URI = 'mongodb://mongoUser:mongo1234@52.56.212.2/information?retryWrites=true&w=majority';//mongo URI
// const cors = require('cors');
// const infoRoutes = require('./api/routes/info');
const mongoose = require('mongoose');
Info = require('./models/info');
Cred = require('./models/cred');
let mongoGrid;
const db = async () =>{
    await mongoose.connect(URI,{ 
        useNewUrlParser: true, 
        useUnifiedTopology: true,
    });
    console.log('db connection successful');
};
db();

app.get('/', function(req, res){
    res.send("GET handled, Please specify /./..")
})
// app.get('/api/personalInfo', (req, res) => {
    
//     mongoGrid..find().toArray(function(err, result) {
//         console.log(result);
//         res.send(result)
//     });
// });
/* 
app.get('/api/information', function(req, res){
    Info.getInfo(function(err, info) {
        if(err){
            throw err;
        }
        res.json(info);
        // res.send("GET handled");
    });
});

 */
// app.use('/api/routes/info', infoRoutes);

// app.use(morgan('dev'));
// app.use(bodyParser.urlencoded({extended: false}));
// app.use(bodyParser.json());
// app.use(express.json());
// app.use(express.urlencoded({extended:false}))
/* 
app.use((req, res, next) =>{
    res.header('Access-Control-Allow-origin', '*');
    res.header(
        'Access-Control-Allow-Headers',
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    if(req.method === 'OPTIONS'){
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }
    next(error);
});

 */
// app.use((req, res, next) =>{
//     const error = new Error('Not Found');
//     error.status(404);
//     next(error);
// });
// app.use((error, req, res, next)=>{
//     res.status(error.status || 500);
//     res.json({
//         error:{
//             message: error.message
//         }
//     });
// });

module.exports = app;