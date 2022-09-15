const express = require('express');
const { authMiddleware, validateMongodbId } = require('../middlewares');
const {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategoryById,
  deleteCategoryById,
} = require('../controllers/category-controller');

const router = express.Router();

router
  .route('/')
  .post(authMiddleware, createCategory)
  .get(authMiddleware, getAllCategories);

router
  .route('/:id')
  .get(authMiddleware, validateMongodbId, getCategoryById)
  .put(authMiddleware, validateMongodbId, updateCategoryById)
  .delete(authMiddleware, validateMongodbId, deleteCategoryById);

module.exports = { categoryRoutes: router };
