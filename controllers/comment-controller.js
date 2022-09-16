const expressAsyncHandler = require('express-async-handler');
const { StatusCodes } = require('http-status-codes');
const { Comment } = require('../model');
const { NotFoundError } = require('../errors');

// create a new comment
exports.createComment = expressAsyncHandler(async (req, res) => {
  const { postId, description } = req.body;

  const comment = await Comment.create({
    post: postId,
    user: req.user.id,
    description,
  });
  res.status(StatusCodes.OK).json(comment);
});

// get all comments
exports.getAllComments = expressAsyncHandler(async (req, res) => {
  const comments = await Comment.find({}).sort('-created');
  res.status(StatusCodes.OK).json(comments);
});

// get comment by id
exports.getCommentById = expressAsyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const comment = await Comment.findById(id);
  if (!comment) {
    return next(new NotFoundError(`Comment with id ${id} not found`));
  }

  return res.status(StatusCodes.OK).json(comment);
});

// update comment by id
exports.updateCommentById = expressAsyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { description } = req.body;

  const updatedComment = await Comment.findByIdAndUpdate(
    id,
    { description },
    { new: true },
  );

  if (!updatedComment) {
    return next(new NotFoundError(`Comment with id ${id} not found`));
  }

  return res.status(StatusCodes.OK).json(updatedComment);
});

// delete comment by id
exports.deleteCommentById = expressAsyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const comment = await Comment.findByIdAndDelete(id);

  if (!comment) {
    return next(new NotFoundError(`Comment with id ${id} not found`));
  }

  return res.status(StatusCodes.OK).json(comment);
});
