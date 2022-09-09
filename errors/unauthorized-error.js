const BaseError = require("./base-error");
const { StatusCodes } = require("http-status-codes");

class UnauthorizedError extends BaseError {
  constructor(msg) {
    super(msg, StatusCodes.UNAUTHORIZED);
  }
}

module.exports = UnauthorizedError;
