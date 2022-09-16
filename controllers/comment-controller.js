const expressAsyncHandler = require('express-async-handler');
const { StatusCodes } = require('http-status-codes');
const { Comment } = require('../model');

exports.createComment = expressAsyncHandler(async (req, res) => {
  const { postId, description } = req.body;

  const comment = await Comment.create({
    post: postId,
    user: req.user.id,
    description,
  });
  res.status(StatusCodes.OK).json(comment);
});

exports.getAllComments = expressAsyncHandler(async (req, res) => {
  const comments = await Comment.find({}).sort('-created');
  res.status(StatusCodes.OK).json(comments);
});
