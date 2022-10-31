const { validationResult } = require('express-validator');
const Post = require("../models/post");
const fs = require('fs');
const path = require('path');

exports.getPosts = (req, res, next) => {
    Post.find()
    .then(posts => {
        console.log(posts);
        res.status(200).json({message: "Fetched posts successfully.", posts: posts});
    })
    .catch(err => {
        if(!err.statusCode){
            err.statusCode = 500;
        }
        next(err);
    });
};

exports.createPost = (req, res, next) => {
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

    const imageUrl = req.file.path.replaceAll("\\" ,"/");
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

exports.updatePost = (req, res, next) => {
    console.log("HEEERRREEE");
    const postId = req.params.postId;
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        const error = new Error('Validation failed, entered data is incorrect.');
        error.statusCode = 422;
        throw error;
    }
    const thumbnailTitle = req.body.ThumbnailTitle;
    let imageUrl = req.file.path.replaceAll("\\" ,"/");
    if(req.file){
        imageUrl = req.file.path.replaceAll("\\" ,"/");;
    }
    if(!imageUrl){
        const error = new Error('No file picked');
        error.statusCode = 422;
        throw error;
    }
    Post.findById(postId)
    .then(post => {
        if(!post){
            const error = new Error('Could not find post');
            error.statusCode = 404;
            throw error;
        }
        if(imageUrl !== post.imageUrl){
            clearImage(post.imageUrl);
        }
        post.thumbnailTitle = thumbnailTitle;
        post.imageUrl = imageUrl;

        return post.save();
    })
    .then(result =>{
        res.status(200).json([
            {
                message: 'Post updated successfully!',
                post: result
            }
        ]);
    })
    .catch(err => {
        if(!err.statusCode){
            err.statusCode = 500;
        }

        next(err);
    })
}

exports.deletePost = (req, res, next) => {
    const postId = req.params.postId;
    Post
    .findById(postId)
    .then(post => {
        if(!post){
            const error = new Error('Could not find post');
            error.statusCode = 404;
            throw error;
        }
        //Check loggedIn User
        clearImage(post.imageUrl);

        return Post.findByIdAndRemove(postId);
    })
    .then(result => {
        console.log(result);
        res.status(200).json({message: 'Deleted post.'});
    })
    .catch(err => {
        if(!err.statusCode){
            err.statusCode = 500;
        }

        next(err);
    });
}

const clearImage = filePath => {
    filePath = path.join(__dirname, '..', filePath);
    fs.unlink(filePath, err => console.log(err));
}