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
    const thumbnailTitle = req.body.ThumbnailTitle;
    res.status(200).json([
            {
                _id: new Date().toISOString(),
                thumbnailTitle: thumbnailTitle
            }
        ]);
};
