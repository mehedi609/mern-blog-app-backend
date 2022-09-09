const { StatusCodes } = require('http-status-codes');

exports.errorHandlingMiddle = (err, req, res, next) => {
  res.status(err.httpCode || StatusCodes.INTERNAL_SERVER_ERROR).json({
    success: false,
    errors:
      typeof err.message === 'string'
        ? [{ message: err.message }]
        : err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });

  return next(err);
};
