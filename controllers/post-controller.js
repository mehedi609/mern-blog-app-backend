const expressAsyncHandler = require('express-async-handler');
const { StatusCodes } = require('http-status-codes');
const Filter = require('bad-words');
const multer = require('multer');
const path = require('path');
const { Post, User } = require('../model');
const {
  ForbiddenError,
  BadRequestError,
  NotFoundError,
  UnauthorizedError,
} = require('../errors');
const { resizePhoto, uploadImgToCloudinary, hasChosen } = require('../utils');

exports.createPost = expressAsyncHandler(async (req, res, next) => {
  try {
    // logger.info(req.body.title);
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

// fetch a posts by id
exports.getPostsById = expressAsyncHandler(async (req, res) => {
  const { id: postId } = req.params;

  const post = await Post.findById(postId).populate('author');

  //update number of views
  post.numViews = post.numViews + 1;
  await post.save();

  res.status(StatusCodes.OK).json(post);
});

// update a posts by id
exports.updatePost = expressAsyncHandler(async (req, res, next) => {
  try {
    const { id: postId } = req.params;

    const post = await Post.findById(postId);

    if (!post) return next(new NotFoundError(`No such post ${postId}`));

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

    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      {
        ...req.body,
        title: req?.body?.title.trim().toLowerCase(),
        image: postImageUrl ? postImageUrl : post.image,
      },
      {
        new: true,
      },
    );

    res.status(StatusCodes.OK).json(updatedPost);
  } catch (error) {
    if (error instanceof multer.MulterError) {
      return next(new BadRequestError(error));
    }

    return next(error);
  }
});

exports.deletePostById = expressAsyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const post = await Post.findById(id);

  if (post.author.toString() !== req.user.id.toString()) {
    return next(
      new UnauthorizedError('You do not have permission to delete this post'),
    );
  }

  const deletePost = await Post.findByIdAndDelete(id);
  res.status(StatusCodes.OK).json(deletePost);
});

exports.likePost = expressAsyncHandler(async (req, res, next) => {
  const { postId } = req.body;
  const loginUserId = req?.user?.id;

  // Find the post to be liked
  const post = await Post.findById(postId);

  if (!post) return next(new NotFoundError(`No such post ${postId}`));

  //3. Find is this user has liked this post?
  const isLiked = post?.isLiked;

  // if already liked, then remove user form likes arr
  if (hasChosen(post.likes, loginUserId)) {
    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      {
        $pull: { likes: loginUserId },
        isLiked: false,
      },
      { new: true },
    );

    return res.status(StatusCodes.OK).json(updatedPost);
  } else {
    // if already disliked remove user from dislikes arr
    if (hasChosen(post?.disLikes, loginUserId)) {
      await Post.findByIdAndUpdate(postId, {
        $pull: { disLikes: loginUserId },
        isLiked: false,
      });
    }

    // now like the post
    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      {
        $push: { likes: loginUserId },
        isLiked: true,
      },
      { new: true },
    );

    return res.status(StatusCodes.OK).json(updatedPost);
  }
});

exports.dislikePost = expressAsyncHandler(async (req, res, next) => {
  const { postId } = req.body;
  const loginUserId = req?.user?.id;

  // Find the post to be liked
  const post = await Post.findById(postId);

  if (!post) return next(new NotFoundError(`No such post ${postId}`));

  // if already disLiked, then remove user form dislikes arr
  if (hasChosen(post?.disLikes, loginUserId)) {
    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      {
        $pull: { disLikes: loginUserId },
        isDisLiked: false,
      },
      { new: true },
    );

    return res.status(StatusCodes.OK).json(updatedPost);
  } else {
    // if already liked remove user from likes arr
    if (hasChosen(post?.likes, loginUserId)) {
      await Post.findByIdAndUpdate(postId, {
        $pull: { likes: loginUserId },
        isLiked: false,
      });
    }

    // now disLike the post
    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      {
        $push: { disLikes: loginUserId },
        isDisLiked: true,
      },
      { new: true },
    );

    return res.status(StatusCodes.OK).json(updatedPost);
  }
});
