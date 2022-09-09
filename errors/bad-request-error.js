const BaseError = require("./base-error");
const { StatusCodes } = require("http-status-codes");

class BadRequestError extends BaseError {
  constructor(msg) {
    super(msg, StatusCodes.BAD_REQUEST);
  }
}

module.exports = BadRequestError;
