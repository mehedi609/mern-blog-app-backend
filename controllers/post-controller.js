const expressAsyncHandler = require('express-async-handler');
const { StatusCodes } = require('http-status-codes');
const Filter = require('bad-words');
const { Post, User } = require('../model');
const { ForbiddenError } = require('../errors');

exports.createPost = expressAsyncHandler(async (req, res, next) => {
  try {
    //Check for bad words
    const filter = new Filter();
    const isProfane = filter.isProfane(req.body.title, req.body.description);
    //Block user
    if (isProfane) {
      await User.findByIdAndUpdate(req.user.id, {
        isBlocked: true,
      });
      return next(
        new ForbiddenError(
          'Creating Failed because it contains profane words and you have been blocked',
        ),
      );
    }

    const post = await Post.create(req.body);
    res.status(StatusCodes.OK).json(post);
  } catch (error) {
    res.json(error);
  }
});
