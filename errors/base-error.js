class BaseError extends Error {
  constructor(message, httpCode) {
    super(message);

    this.message = message;
    this.httpCode = httpCode;

    Object.setPrototypeOf(this, BaseError.prototype);
  }
}

module.exports = BaseError;
