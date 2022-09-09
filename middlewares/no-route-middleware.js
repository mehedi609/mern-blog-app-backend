const BaseError = require('../errors/base-error');
const { StatusCodes } = require('http-status-codes');

exports.routeNotFoundMiddleware = (_req, _res, next) => {
  const err = new BaseError('Route not found', StatusCodes.NOT_FOUND);
  next(err);
};
