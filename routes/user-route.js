const express = require('express');
const {
  getAllUsers,
  removeUser,
  getUserDetails,
  getUserProfile,
  updateUser,
  updateUserPassword,
} = require('../controllers/user-controller');
const { validateMongodbId, authMiddleware } = require('../middlewares');

const router = express.Router();

router.get('/', getAllUsers);
router.put('/password', authMiddleware, updateUserPassword);

router
  .route('/profile')
  .get(authMiddleware, getUserProfile)
  .put(authMiddleware, updateUser);

router
  .route('/:id')
  .get(validateMongodbId, getUserDetails)
  .delete(validateMongodbId, removeUser);

module.exports = { userRoutes: router };
