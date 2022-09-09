const expressAsyncHandler = require('express-async-handler');
const { StatusCodes } = require('http-status-codes');
const { User } = require('../model');
const logger = require('../logger');

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

module.exports = {
  getAllUsers,
  removeUser,
  getUserDetails,
  getUserProfile,
  updateUser,
  updateUserPassword,
};
