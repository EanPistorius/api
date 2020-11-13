const express = require('express');
const mongoose = require('mongoose');
const GridFsStorage = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');
const cors = require('cors');
const app = express();app.use(cors());
const PORT = process.env.PORT || 8000;

const URI = 'mongodb://test:1234@52.56.212.2/Test?retryWrites=true&w=majority';//mongo URI

const connection = mongoose.createConnection(URI);

let mongoGrid;

connection.once('open', () => {
    //Initialize MongoDB grid and collection
    mongoGrid = Grid(connection.db, mongoose.mongo);
    mongoGrid.collection('Animals');
    console.log('Mongo connection open');
});


//Get all records from specified collection

app.get('/files', (req, res) => {
    
    mongoGrid.files.find().toArray(function(err, result) {
        console.log(result);
        res.send(result)
    });
});



app.get('/', (req, res) => {
    res.send('Homepage')
    console.log('Successful /')
})

app.listen(PORT, () => {
    console.log("Server is listening on port " + PORT);
})
