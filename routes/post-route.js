const express = require('express');
const { authMiddleware, photoUploadMiddleware } = require('../middlewares');
const { createPost, getAllPosts } = require('../controllers/post-controller');

const router = express.Router();

router
  .route('/')
  .post(authMiddleware, photoUploadMiddleware.single('image'), createPost)
  .get(authMiddleware, getAllPosts);

module.exports = { postRoutes: router };
