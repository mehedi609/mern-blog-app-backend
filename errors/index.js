const BadRequestError = require('./bad-request-error');
const NotFoundError = require('./not-found-error');
const UnauthorizedError = require('./unauthorized-error');
const BaseError = require('./base-error');
const CastError = require('./cast-error');
const ForbiddenError = require('./forbidden-error');

module.exports = {
  BadRequestError,
  NotFoundError,
  UnauthorizedError,
  BaseError,
  CastError,
  ForbiddenError,
};
