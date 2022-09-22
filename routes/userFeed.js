const express = require('express');
const userFeedController = require('../controllers/userFeed');
const router = express.Router();

router.get('/posts', userFeedController.getPosts);

router.post('/post', userFeedController.createPost);

module.exports = router;