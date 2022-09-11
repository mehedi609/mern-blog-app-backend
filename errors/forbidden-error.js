const BaseError = require('./base-error');
const { StatusCodes } = require('http-status-codes');

class ForbiddenError extends BaseError {
  constructor(msg) {
    super(msg, StatusCodes.FORBIDDEN);
  }
}

module.exports = ForbiddenError;
