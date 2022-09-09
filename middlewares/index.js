const { routeNotFoundMiddleware } = require('./no-route-middleware');
const { errorHandlingMiddle } = require('./error-handling-middleware');

module.exports = { routeNotFoundMiddleware, errorHandlingMiddle };
