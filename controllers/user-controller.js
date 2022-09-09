const expressAsyncHandler = require('express-async-handler');
const User = require('../model/User');
const { StatusCodes } = require('http-status-codes');

// get all users
const getAllUsers = expressAsyncHandler(async (req, res) => {
  const users = await User.find({});
  return res.status(StatusCodes.OK).json(users);
});

module.exports = { getAllUsers };
