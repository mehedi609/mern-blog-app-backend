const expressAsyncHandler = require('express-async-handler');
const { StatusCodes } = require('http-status-codes');
const { User } = require('../model');
const logger = require('../logger');
const { BadRequestError } = require('../errors');

// get all users
const getAllUsers = expressAsyncHandler(async (req, res) => {
  logger.info(req.params.id);
  const users = await User.find({});
  return res.status(StatusCodes.OK).json(users);
});

// delete user by id
const removeUser = expressAsyncHandler(async (req, res) => {
  const { id } = req?.params;

  const deletedUser = await User.findByIdAndDelete(id);
  res.status(StatusCodes.OK).json(deletedUser);
});

// get user details by id
const getUserDetails = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;

  const user = await User.findById(id);
  res.status(StatusCodes.OK).json(user);
});

// get logged-in user details
const getUserProfile = expressAsyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  res.status(StatusCodes.OK).json(user);
});

// update logged-in user profile
const updateUser = expressAsyncHandler(async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req.user.id,
    {
      firstName: req?.body?.firstName,
      lastName: req?.body?.lastName,
      email: req?.body?.email,
      bio: req?.body?.bio,
    },
    {
      new: true,
      runValidators: true,
    },
  );
  res.status(StatusCodes.OK).json(user);
});

// update user password
const updateUserPassword = expressAsyncHandler(async (req, res) => {
  const { id } = req.user;
  const { password } = req.body;

  //Find the user by _id
  const user = await User.findById(id);

  if (password) {
    user.password = password;
    const updatedUser = await user.save();
    res.status(StatusCodes.OK).json(updatedUser);
  } else {
    res.status(StatusCodes.OK).json(user);
  }
});

const followingUser = expressAsyncHandler(async (req, res, next) => {
  const { followId } = req.body;
  const loginUserId = req.user.id;

  // check if the user is already following the target user
  const alreadyFollowing = req.user.following.some(
    (userId) => userId.toString() === followId.toString(),
  );
  if (alreadyFollowing)
    return next(new BadRequestError('You have already followed this user'));

  //1. Find the user you want to follow and update it's followers field
  await User.findByIdAndUpdate(followId, {
    $push: { followers: loginUserId },
    isFollowing: true,
  });

  //2. Update the login user following field
  await User.findByIdAndUpdate(loginUserId, {
    $push: { following: followId },
  });

  res
    .status(StatusCodes.OK)
    .json({ message: 'You have successfully followed this user' });
});

const unFollowUser = expressAsyncHandler(async (req, res, next) => {
  const { unfollowIn } = req.body;
  const loginUserId = req.user.id;

  // check if the user is following the target user
  const isFollowing = req.user.following.some(
    (userId) => userId.toString() === unfollowIn.toString(),
  );
  if (!isFollowing)
    return next(new BadRequestError('You are not following this user'));

  //1. Find the user you want to follow and update it's followers field
  await User.findByIdAndUpdate(unfollowIn, {
    $pull: { followers: loginUserId },
    isFollowing: false,
  });

  //2. Update the login user following field
  await User.findByIdAndUpdate(loginUserId, {
    $pull: { following: unfollowIn },
  });

  res
    .status(StatusCodes.OK)
    .json({ message: 'You have successfully unFollow this user' });
});

module.exports = {
  getAllUsers,
  removeUser,
  getUserDetails,
  getUserProfile,
  updateUser,
  updateUserPassword,
  followingUser,
  unFollowUser,
};
