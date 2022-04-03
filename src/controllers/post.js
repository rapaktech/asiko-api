const Post = require('../models/post');
const User = require('../models/user');
const cloudinary = require('cloudinary');
const formidable = require('formidable');


exports.getPosts = async (req, res, next) => {
    try {
        const posts = await Post.find().populate('userId');
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
            if (err) throw err;
            if (!files) return res.status(400).json({ message: 'Image File Missing In Request Body' });
            cloudinary.v2.uploader.upload(files.file.filepath, {
                public_id: `${Date.now()}`,
                resource_type: 'auto'
            }, (err, result) => {
                if (err) throw err;
                if (fields.caption) {
                    if (result.url) {
                        Post.create({
                            userId: req.user.id,
                            caption: fields.caption,
                            imageUrl: result.url
                        }, (err, newPost) => {
                            if (err) throw err;
                            User.findById(req.user.id, (err, foundUser) => {
                                if (err) throw err;
                                foundUser.posts.push(newPost._id);
                                foundUser.save((err, saved) => {
                                    if (err) throw err;
                                    else return res.status(200).json({ message: 'Post Uploaded Successfully!' });
                                });
                            });
                        });
                    } else {
                        return res.status(400).json({ message: 'Image Url Missing' });
                    }
                } else {
                    return res.status(400).json({ message: 'Caption Missing In Request Body' });
                }
            });
        });
    } catch (error) {
        next(error);
    }
}