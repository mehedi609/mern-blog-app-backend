const express = require('express');
const {
  getAllUsers,
  removeUser,
  getUserDetails,
  getUserProfile,
  updateUser,
  updateUserPassword,
  followingUser,
  unFollowUser,
} = require('../controllers/user-controller');
const { validateMongodbId, authMiddleware } = require('../middlewares');

const router = express.Router();

router.get('/', getAllUsers);
router.put('/password', authMiddleware, updateUserPassword);
router.put('/follow', authMiddleware, followingUser);
router.put('/unfollow', authMiddleware, unFollowUser);

router
  .route('/profile')
  .get(authMiddleware, getUserProfile)
  .put(authMiddleware, updateUser);

router
  .route('/:id')
  .get(validateMongodbId, getUserDetails)
  .delete(validateMongodbId, removeUser);

module.exports = { userRoutes: router };
