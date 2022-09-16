const express = require('express');
const {
  createComment,
  getAllComments,
} = require('../controllers/comment-controller');

const router = express.Router();

router.route('/').post(createComment).get(getAllComments);

module.exports = { commentRoutes: router };
