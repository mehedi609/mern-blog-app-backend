const { StatusCodes } = require('http-status-codes');
const expressAsyncHandler = require('express-async-handler');
const { NotFoundError } = require('../errors');
const { Category } = require('../model');

// create new category
exports.createCategory = expressAsyncHandler(async (req, res) => {
  const category = new Category({
    user: req.user._id,
    title: req.body.title,
  });
  await category.save();

  res.status(StatusCodes.OK).json(category);
});

// get all categories
exports.getAllCategories = expressAsyncHandler(async (req, res) => {
  const categories = await Category.find({})
    .populate('user')
    .sort('-createdAt');

  res.status(StatusCodes.OK).json(categories);
});

// get category by id
exports.getCategoryById = expressAsyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const category = await Category.findOne({ id })
    .populate('user')
    .sort('-createdAt');

  if (!category)
    return next(new NotFoundError(`Category with id ${id} not found!`));

  res.status(StatusCodes.OK).json(category);
});

// update category by id
exports.updateCategoryById = expressAsyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const updatedCategory = await Category.findOneAndUpdate(
    { id },
    {
      title: req?.body?.title,
    },
    {
      new: true,
    },
  );

  res.status(StatusCodes.OK).json(updatedCategory);
});

// delete category by id
exports.deleteCategoryById = expressAsyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const category = await Category.findOneAndDelete({ id });

  res.status(StatusCodes.OK).json(category);
});
