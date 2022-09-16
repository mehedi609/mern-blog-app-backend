const express = require('express');
const {
  createComment,
  getAllComments,
  getCommentById,
  updateCommentById,
  deleteCommentById,
} = require('../controllers/comment-controller');
const { authMiddleware, validateMongodbId } = require('../middlewares');

const router = express.Router();

router
  .route('/')
  .post(authMiddleware, createComment)
  .get(authMiddleware, getAllComments);

router
  .route('/:id')
  .get(authMiddleware, validateMongodbId, getCommentById)
  .put(authMiddleware, validateMongodbId, updateCommentById)
  .delete(authMiddleware, validateMongodbId, deleteCommentById);

module.exports = { commentRoutes: router };
