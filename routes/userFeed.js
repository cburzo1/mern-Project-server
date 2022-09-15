const express = require('express');
const userFeedController = require('../controllers/userFeed');
const router = express.Router();

router.get('/posts', userFeedController.getPosts);

module.exports = router;