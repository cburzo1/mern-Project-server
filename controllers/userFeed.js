const { validationResult } = require('express-validator');
const Post = require("../models/post");

exports.getPosts = (req, res) => {
    res.status(200).json([
            {
                _id: '1',
                thumbnailTitle: "Video: How to ThumbNail: Part1",
                userName:"Ed Summit",
                thumbnailImageUrl: "images/car1.png",
                logoImage: "",
                views: 30,
                timeEllapseSincePost: new Date()
            }
        ]);
};

exports.createPost = (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(422).json({
                message: 'Validation failed, entered data is incorrect.', 
                errors: errors.array()
            });
    }
    const thumbnailTitle = req.body.ThumbnailTitle;
    const post = new Post({
        thumbnailTitle: thumbnailTitle,
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
    .catch(err => console.log(err));
    
};
