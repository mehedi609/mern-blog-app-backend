require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const { dbConnect } = require('./config');
const { authRoutes, userRoutes, postRoutes } = require('./routes');
const logger = require('./logger');
const {
  routeNotFoundMiddleware,
  errorHandlingMiddleware,
} = require('./middlewares');

const app = express();

// DB
dbConnect();

// Middleware
app.use(express.json());

if (process.env.NODE_ENV === 'development') {
  app.use(
    morgan('tiny', {
      stream: { write: (message) => logger.info(message.trim()) },
    }),
  );
}

// auth route
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/posts', postRoutes);

// error handler
app.use(routeNotFoundMiddleware);
app.use(errorHandlingMiddleware);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  if (process.env.NODE_ENV === 'development')
    console.log(`Server is running on http://localhost:${PORT}`);
  else console.log(`Server is running on ${PORT}`);
});
