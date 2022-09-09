const BaseError = require("./base-error");
const { StatusCodes } = require("http-status-codes");

class NotFoundError extends BaseError {
  constructor(msg) {
    super(msg, StatusCodes.NOT_FOUND);
  }
}

module.exports = NotFoundError;
