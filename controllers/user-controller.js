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

//Delete user
const removeUser = expressAsyncHandler(async (req, res) => {
  const { id } = req?.params;

  const deletedUser = await User.findByIdAndDelete(id);
  res.status(StatusCodes.OK).json(deletedUser);
});

module.exports = { getAllUsers, removeUser };
