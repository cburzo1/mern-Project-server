const express = require('express');
const userFeedController = require('../controllers/userFeed');
const router = express.Router();
const { body } = require('express-validator');
//check request body
router.get('/posts', userFeedController.getPosts);

router.post('/post', [
    body('ThumbnailTitle').trim().isLength({min: 1})
], userFeedController.createPost);

router.post('/post/:postId',[
    body('ThumbnailTitle').trim().isLength({min: 1})
], userFeedController.updatePost);

router.post('/postDelete/:postId', userFeedController.deletePost);

module.exports = router;