const User = require("../model/User");
const expressAsyncHandler = require("express-async-handler");
const BadRequestError = require("../errors/bad-request-error");

//Register
exports.register = expressAsyncHandler(async (req, res, next) => {
  const existingUser = await User.findOne({ email: req?.body?.email });

  if (existingUser) return next(new BadRequestError("User already exists"));

  //Register user
  const user = await User.create({
    firstName: req?.body?.firstName,
    lastName: req?.body?.lastName,
    email: req?.body?.email,
    password: req?.body?.password,
  });

  res.status(201).json(user);
});
