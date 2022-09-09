const express = require('express');
const {
  getAllUsers,
  removeUser,
  getUserDetails,
  getUserProfile,
} = require('../controllers/user-controller');
const { validateMongodbId, authMiddleware } = require('../middlewares');

const router = express.Router();

router.get('/', getAllUsers);

router.get('/profile', authMiddleware, getUserProfile);

router
  .route('/:id')
  .get(validateMongodbId, getUserDetails)
  .delete(validateMongodbId, removeUser);

module.exports = { userRoutes: router };
