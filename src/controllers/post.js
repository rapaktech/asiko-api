const Post = require('../models/post');
const User = require('../models/user');
const cloudinary = require('cloudinary');
const formidable = require('formidable');


exports.getPosts = async (req, res, next) => {
    try {
        const posts = await Post.find();
        if (!posts) {
            return res.status(400).json({ message: 'No Posts' });
        }
        return res.status(200).json({ posts });
    } catch (error) {
        next(error); 
    }
}

exports.createPost = async (req, res, next) => {
    try {
        const form = formidable();

        form.parse(req, (err, fields, files) => {
            if (err) {
                next(err);
            }

            cloudinary.v2.uploader.upload(files.file.filepath, {
                public_id: `${Date.now()}`,
                resource_type: 'auto'
            }, (err, result) => {
                if (err) next(err);
                const newPost = new Post({
                    userId: req.user.id,
                    caption: fields.caption,
                    imageUrl: result.url
                }).save();
            
                User.findById(req.user.id, (err, foundUser) => {
                    if (err) throw err;
                    foundUser.posts.push(newPost._id);
                    foundUser.save((err, saved) => {
                        if (err) throw err;
                        else return res.status(200).json({ message: 'Post Uploaded Successfully!' });
                    });
                });
            });
        });
    } catch (error) {
        next(error);
    }
}