const express = require('express');
const { getPosts, createPost } = require('./../controllers/post');
const checkIfUser = require('./../middleware/user');
const router = express.Router();

router.post('/createpost', checkIfUser(), createPost);

router.get('/feed', checkIfUser() , getPosts);

module.exports = router;