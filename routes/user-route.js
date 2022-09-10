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
  blockUser,
  unBlockUser,
  sendVerificationEmail,
  accountVerify,
  forgetPassword,
  resetPassword,
} = require('../controllers/user-controller');
const { validateMongodbId, authMiddleware } = require('../middlewares');

const router = express.Router();

router.get('/', getAllUsers);
router.put('/password', authMiddleware, updateUserPassword);
router.put('/follow', authMiddleware, followingUser);
router.put('/unfollow', authMiddleware, unFollowUser);
router.put('/block-user', authMiddleware, blockUser);
router.put('/unblock-user', authMiddleware, unBlockUser);
router.post('/send-verify-email', authMiddleware, sendVerificationEmail);
router.put('/verify-account', authMiddleware, accountVerify);
router.post('/send-forget-password', forgetPassword);
router.put('/reset-password', resetPassword);

router
  .route('/profile')
  .get(authMiddleware, getUserProfile)
  .put(authMiddleware, updateUser);

router
  .route('/:id')
  .get(validateMongodbId, getUserDetails)
  .delete(validateMongodbId, removeUser);

module.exports = { userRoutes: router };
