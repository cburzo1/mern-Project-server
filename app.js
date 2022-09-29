const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const userFeedRoutes = require('./routes/userFeed');
const mongoose = require('mongoose');

app.use(bodyParser.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, PATCH, DELETE' );
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

app.use('/userFeed', userFeedRoutes);

mongoose.connect(
    'mongodb+srv://-:-@cluster0.d0gwoea.mongodb.net/userPanel'
).then(result => {
    app.listen(3001);
})
.catch(err => console.log(err));