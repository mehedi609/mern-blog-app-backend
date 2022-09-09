const express = require('express');
const {
  getAllUsers,
  removeUser,
  getUserDetails,
} = require('../controllers/user-controller');
const { validateMongodbId } = require('../middlewares');

const router = express.Router();

router.get('/', getAllUsers);

router
  .route('/:id')
  .get(validateMongodbId, getUserDetails)
  .delete(validateMongodbId, removeUser);

module.exports = { userRoutes: router };
