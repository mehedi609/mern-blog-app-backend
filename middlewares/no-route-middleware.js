const BaseError = require('../errors/base-error');
const { StatusCodes } = require('http-status-codes');

const routeNotFoundMiddleware = (req, res, next) => {
  const err = new BaseError(
    `Route not found - ${req.originalUrl}`,
    StatusCodes.NOT_FOUND,
  );
  next(err);
};

module.exports = routeNotFoundMiddleware;
