const express = require('express');
const { authMiddleware, photoUploadMiddleware } = require('../middlewares');
const { createPost } = require('../controllers/post-controller');

const router = express.Router();

router.post(
  '/',
  authMiddleware,
  photoUploadMiddleware.single('image'),
  createPost,
);

module.exports = { postRoutes: router };
