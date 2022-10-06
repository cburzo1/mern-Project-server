const { validationResult } = require('express-validator');
const Post = require("../models/post");

exports.getPosts = (req, res) => {
    Post.find()
    .then(posts => {
        res.status(200).json({message: "Fetched posts successfully.", posts: posts});
    })
    .catch(err => {
        if(!err.statusCode){
            err.statusCode = 500;
        }
        next(err);
    });
};

exports.createPost = (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        const error = new Error('Validation failed, entered data is incorrect.');
        error.statusCode = 422;
        throw error;
    }
    if(!req.file){
        const error = new Error('NO image provided.');
        error.statusCode = 422;
        throw error;
    }

    const imageUrl = req.file.path;
    const thumbnailTitle = req.body.ThumbnailTitle;
    const post = new Post({
        thumbnailTitle: thumbnailTitle,
        imageUrl: imageUrl,
        creator: {
            userName: "Ed Summit"
        }
    });

    post
    .save()
    .then(result => {
        console.log(result);

        res.status(200).json([
            {
                message: 'Post created successfully!',
                post: result
            }
        ]);
    })
    .catch(err => {
        if(!err.statusCode){
            err.statusCode = 500;
        }

        next(err);
    });
    
};
