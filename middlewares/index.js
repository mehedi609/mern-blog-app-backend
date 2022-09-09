const routeNotFoundMiddleware = require('./no-route-middleware');
const errorHandlingMiddleware = require('./error-handling-middleware');
const validateMongodbId = require('./validate-mongodb-id-middleware');

module.exports = {
  routeNotFoundMiddleware,
  errorHandlingMiddleware,
  validateMongodbId,
};
