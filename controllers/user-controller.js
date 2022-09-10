const expressAsyncHandler = require('express-async-handler');
const { StatusCodes } = require('http-status-codes');
const jwt = require('jsonwebtoken');
const { User } = require('../model');
const logger = require('../logger');
const { BadRequestError, UnauthorizedError } = require('../errors');
const { sendEmail } = require('../utils');
const dayjs = require('dayjs');

// get all users
const getAllUsers = expressAsyncHandler(async (req, res) => {
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

// Block user
const blockUser = expressAsyncHandler(async (req, res) => {
  const { id } = req.body;

  const user = await User.findByIdAndUpdate(
    id,
    {
      isBlocked: true,
    },
    { new: true },
  );
  res.status(StatusCodes.OK).json(user);
});

// Unblock user
const unBlockUser = expressAsyncHandler(async (req, res) => {
  const { id } = req.body;

  const user = await User.findByIdAndUpdate(
    id,
    {
      isBlocked: false,
    },
    { new: true },
  );
  res.status(StatusCodes.OK).json(user);
});

// send account verification token via email
const sendVerificationEmail = expressAsyncHandler(async (req, res, next) => {
  const loginUserId = req.user.id;

  const user = await User.findById(loginUserId);

  if (dayjs().isBefore(dayjs(user.accountVerificationTokenExpires)))
    return next(
      new BadRequestError(
        'Verification email has already been sent. Please check your email',
      ),
    );
  else if (user.isAccountVerified)
    return next(new BadRequestError('This account has already been verified'));

  const verificationToken = await user.createAccountVerificationToken(
    loginUserId,
  );

  await user.save();

  await sendEmail(user.email, {
    name: user.firstName,
    url: `${process.env.BASE_URL_FRONTEND}/verify-account/${verificationToken}`,
  });

  res.status(StatusCodes.OK).json({
    message:
      'Verification email sent successfully. Please check your email to active your account.',
  });
});

// verify and activate account
const accountVerify = expressAsyncHandler(async (req, res, next) => {
  const { token } = req.body;

  try {
    const decoded = jwt.verify(token, process.env.JWT_KEY);

    if (decoded?.id.toString() !== req.user.id.toString()) {
      return next(
        new UnauthorizedError(
          'You are not authorized to activate this account.',
        ),
      );
    }

    /*    const userFound = await User.findById(decoded?.id).select('-password');

    //update the proprt to true
    userFound.isAccountVerified = true;
    userFound.accountVerificationToken = undefined;
    userFound.accountVerificationTokenExpires = undefined;
    // await userFound.save();*/

    const updatedUser = await User.findByIdAndUpdate(
      decoded.id,
      {
        isAccountVerified: true,
        accountVerificationToken: null,
        accountVerificationTokenExpires: null,
      },
      {
        new: true,
        runValidators: true,
      },
    );

    res.status(StatusCodes.OK).json(updatedUser);
  } catch (error) {
    logger.error(error);
    return next(
      new UnauthorizedError(
        'Not authorized! token invalid or expired, try again',
      ),
    );
  }
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
  blockUser,
  unBlockUser,
  sendVerificationEmail,
  accountVerify,
};
