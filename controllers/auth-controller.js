const User = require('../model/User');
const expressAsyncHandler = require('express-async-handler');
const BadRequestError = require('../errors/bad-request-error');
const { StatusCodes } = require('http-status-codes');
const UnauthorizedError = require('../errors/unauthorized-error');
const generateToken = require('../utils/generateToken');

//Register
exports.register = expressAsyncHandler(async (req, res, next) => {
  const existingUser = await User.findOne({ email: req?.body?.email });

  if (existingUser) return next(new BadRequestError('User already exists'));

  //Register user
  const user = await User.create({
    firstName: req?.body?.firstName,
    lastName: req?.body?.lastName,
    email: req?.body?.email,
    password: req?.body?.password,
  });

  res.status(StatusCodes.CREATED).json(user);
});

exports.login = expressAsyncHandler(async (req, res, next) => {
  const { email, password } = req?.body;

  //check if user exists
  const userFound = await User.findOne({ email });

  //Check if password is match
  if (userFound && (await userFound.isPasswordMatched(password))) {
    return res.status(StatusCodes.OK).json({
      firstName: userFound?.firstName,
      lastName: userFound?.lastName,
      email: userFound?.email,
      profilePhoto: userFound?.profilePhoto,
      isAdmin: userFound?.isAdmin,
      token: generateToken(userFound?.id),
    });
  }

  return next(new UnauthorizedError('Invalid credentials'));
});
