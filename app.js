const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const userFeedRoutes = require('./routes/userFeed');

app.use(bodyParser.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, PATCH, DELETE' );
    res.setHeader('Access-Control-Allow-Header', 'Content-Type, Authorization');
    next();
});

app.use('/userFeed', userFeedRoutes);

app.listen(3001);