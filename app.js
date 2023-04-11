const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const userFeedRoutes = require('./routes/userFeed');
const authRoutes = require('./routes/auth');
const mongoose = require('mongoose');
const path = require('path');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
require("dotenv").config();
const port = process.env.PORT || 3000

console.log('PROCESS', process.env.mongoURI);

app.use(express.static(path.join(__dirname, 'build')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
})

const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'images');
    },
    filename: (req, file, cb) => {
        cb(null, uuidv4());
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
app.use('/auth', authRoutes);

app.use((error, req,res, next) =>{
    console.log(error);
    const status = error.statusCode;
    const message = error.message;
    const data = error.data;
    res.status(status).json({message: message, data: data});
});

//serve static assets if in production
/*if(process.env.NODE_ENV === 'production'){
    //set static folder
    app.use(express.static('C:/Users/cb/Desktop/Life_Tracker/Code/Projects/mernProjectFullStack/mern-project-client/mern-Project/build'));
    app.get('*', (req, res) =>{
        res.sendFile(path.resolve(__dirname, "mern-Project", "build", 'index.html'));
    });
}*/

mongoose.connect(
    /*ADD MONGO URI HERE INSIDE THE SINGLE QUOTES*/
    process.env.mongoURI
).then(result => {
    app.listen(port);
})
.catch(err => console.log(err));