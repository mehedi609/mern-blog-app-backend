const expressAsyncHandler = require('express-async-handler');
const { StatusCodes } = require('http-status-codes');
const { User } = require('../model');

// get all users
const getAllUsers = expressAsyncHandler(async (req, res) => {
  const users = await User.find({});
  return res.status(StatusCodes.OK).json(users);
});

module.exports = { getAllUsers };
