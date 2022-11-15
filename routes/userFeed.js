const express = require('express');
const userFeedController = require('../controllers/userFeed');
const router = express.Router();
const { body } = require('express-validator');
const isAuth = require('../middleware/is-auth');
//check request body
router.get('/posts',userFeedController.getPosts);

router.get('/utility', isAuth,userFeedController.getUtilityPosts);

router.post('/post', isAuth,[
    body('ThumbnailTitle').trim().isLength({min: 1})
], userFeedController.createPost);

router.post('/post/:postId',isAuth,[
    body('ThumbnailTitle').trim().isLength({min: 1})
],  userFeedController.updatePost);

router.post('/postDelete/:postId',isAuth, userFeedController.deletePost);

module.exports = router;