const express = require('express');
const { authMiddleware } = require('../middlewares');
const { createPost } = require('../controllers/post-controller');

const router = express.Router();

router.post('/', authMiddleware, createPost);

module.exports = { postRoutes: router };
