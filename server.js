require('dotenv').config();
const express = require('express');
const dbConnect = require('./config/dbConnect');
const { userRouter } = require('./routes/auth-route');
const {
  errorHandlingMiddle,
} = require('./middlewares/error-handling-middleware');
const {
  routeNotFoundMiddleware,
} = require('./middlewares/no-route-middleware');

const app = express();

// DB
dbConnect();

// Middleware
app.use(express.json());

// auth route
app.use('/api/v1/auth', userRouter);

// error handler
app.use(routeNotFoundMiddleware);
app.use(errorHandlingMiddle);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Server is running on http://localhost:${PORT}`),
);
