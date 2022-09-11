const expressAsyncHandler = require('express-async-handler');
const { StatusCodes } = require('http-status-codes');
const Filter = require('bad-words');
const multer = require('multer');
const path = require('path');
const { Post, User } = require('../model');
const { ForbiddenError, BadRequestError } = require('../errors');
const logger = require('../logger');
const { resizePhoto, uploadImgToCloudinary } = require('../utils');

exports.createPost = expressAsyncHandler(async (req, res, next) => {
  try {
    logger.info(req.body.title);
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

    let postImageUrl = '';

    // upload post image if there is a file
    if (req.file) {
      // 1. resize and save to local path
      const filePath = 'public/images';
      await resizePhoto(req.file, filePath);

      // 2. Get the local path of img
      const localPath = path.join(`${filePath}`, `${req.file.filename}`);

      // 3.Upload to cloudinary
      const imgUploaded = await uploadImgToCloudinary(localPath);
      postImageUrl = imgUploaded.url;
    }

    const newPost = new Post({
      ...req.body,
      title: req.body.title.trim().toLowerCase(),
      author: req.user.id,
    });

    if (postImageUrl) newPost.image = postImageUrl;

    await newPost.save();
    res.status(StatusCodes.OK).json(newPost);
  } catch (error) {
    logger.error(error);

    if (error instanceof multer.MulterError) {
      return next(new BadRequestError(error));
    }

    return next(error);
  }
});

// fetch all posts
exports.getAllPosts = expressAsyncHandler(async (req, res) => {
  const posts = await Post.find({}).populate('author');
  res.status(StatusCodes.OK).json(posts);
});
