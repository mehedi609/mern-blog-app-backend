const express = require('express');
const {
  authMiddleware,
  photoUploadMiddleware,
  validateMongodbId,
} = require('../middlewares');
const {
  createPost,
  getAllPosts,
  getPostsById,
  updatePost,
  deletePostById,
} = require('../controllers/post-controller');

const router = express.Router();

router
  .route('/')
  .post(authMiddleware, photoUploadMiddleware.single('image'), createPost)
  .get(authMiddleware, getAllPosts);

router
  .route('/:id')
  .get(authMiddleware, validateMongodbId, getPostsById)
  .put(authMiddleware, validateMongodbId, updatePost)
  .delete(authMiddleware, validateMongodbId, deletePostById);

module.exports = { postRoutes: router };
