const expressAsyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const { User } = require('../model');
const { UnauthorizedError } = require('../errors');
const logger = require('../logger');

const authMiddleware = expressAsyncHandler(async (req, res, next) => {
  let token;

  if (req?.headers?.authorization?.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      if (token) {
        const decoded = jwt.verify(token, process.env.JWT_KEY);

        //find the user by id
        const user = await User.findById(decoded?.id).select('-password');

        //attach the user to the request object
        req.user = {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
        };
        return next();
      } else {
        return next(
          new UnauthorizedError('There is no token attached to the header'),
        );
      }
    } catch (error) {
      logger.error(error);
      return next(
        new UnauthorizedError(
          'Not authorized! token invalid or expired, login again',
        ),
      );
    }
  }

  return next(
    new UnauthorizedError('There is no token attached to the header'),
  );
});

module.exports = authMiddleware;
