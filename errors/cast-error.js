const BaseError = require('./base-error');
const { StatusCodes } = require('http-status-codes');

class CastError extends BaseError {
  constructor(msg) {
    super(msg, StatusCodes.NOT_ACCEPTABLE);
  }
}

module.exports = CastError;
