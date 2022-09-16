const { authRoutes } = require('./auth-route');
const { userRoutes } = require('./user-route');
const { postRoutes } = require('./post-route');
const { categoryRoutes } = require('./category-route');
const { commentRoutes } = require('./comment-route');

module.exports = { authRoutes, userRoutes, postRoutes, categoryRoutes, commentRoutes };
