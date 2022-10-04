const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const userFeedRoutes = require('./routes/userFeed');
const mongoose = require('mongoose');
const path = require('path');

app.use(bodyParser.json());

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
    const message = error.meesage;
    res.status(status).json({message: message});
});

mongoose.connect(
    'mongodb+srv://cboz:Luther66@cluster0.d0gwoea.mongodb.net/userPanel'
).then(result => {
    app.listen(3001);
})
.catch(err => console.log(err));