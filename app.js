const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const userFeedRoutes = require('./routes/userFeed');
const mongoose = require('mongoose');
const path = require('path');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');

const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, 'images'));
    },
    filename: (req, file, cb) => {
        cb(null, uuidv4() + '-' + file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    if(
        file.mimetype === 'image/png' || 
        file.mimetype === 'image/jpg' || 
        file.mimetype === 'image/jpeg'
    ){
        cb(null, true);
    }else{
        cb(null, false);
    }
}

app.use(bodyParser.json());
app.use(
    multer({storage: fileStorage, fileFilter: fileFilter}).single('image')
);
app.use('/images', express.static(path.join(__dirname, 'images')));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, PATCH, DELETE' );
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

app.use('/userFeed', userFeedRoutes);

app.use((error, req,res, next) =>{
    console.log(error);
    const status = error.statusCode;
    const message = error.message;
    res.status(status).json({message: message});
});

mongoose.connect(
    'mongodb+srv://cboz:Luther66@cluster0.d0gwoea.mongodb.net/userPanel'
).then(result => {
    app.listen(3001);
})
.catch(err => console.log(err));