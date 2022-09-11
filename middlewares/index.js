const routeNotFoundMiddleware = require('./no-route-middleware');
const errorHandlingMiddleware = require('./error-handling-middleware');
const validateMongodbId = require('./validate-mongodb-id-middleware');
const authMiddleware = require('./auth-middleware');
const { photoUploadMiddleware } = require('./photo-upload-middleware');

module.exports = {
  routeNotFoundMiddleware,
  errorHandlingMiddleware,
  validateMongodbId,
  authMiddleware,
  photoUploadMiddleware,
};
