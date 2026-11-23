
const Category = require('../models/category.model');
const asyncHandler = require('../utils/asyncHandler');
const { success, created, notFound } = require('../utils/response');

// GET /api/categories
const getAll = asyncHandler(async (req, res) => {
  const categories = await Category.findAll();

  return success(
    res,
    categories,
    'Categories retrieved successfully'
  );
});

// GET /api/categories/:id
const getOne = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);

  if (!category) {
    return notFound(res, 'Category not found');
  }

  return success(
    res,
    category,
    'Category retrieved successfully'
  );
});

// POST /api/categories
const store = asyncHandler(async (req, res) => {
  const category = await Category.create(req.body.name);

  return created(
    res,
    category,
    'Category created successfully'
  );
});

// PUT /api/categories/:id
const update = asyncHandler(async (req, res) => {
  const existing = await Category.findById(req.params.id);

  if (!existing) {
    return notFound(res, 'Category not found');
  }

  const category = await Category.update(
    req.params.id,
    req.body.name
  );

  return success(
    res,
    category,
    'Category updated successfully'
  );
});

// DELETE /api/categories/:id

const destroy = asyncHandler(async (req, res) => {
  const existing = await Category.findById(req.params.id);

  if (!existing) {
    return notFound(res, 'Category not found');
  }

  const hasProducts = await Category.hasProducts(req.params.id);

  if (hasProducts) {
    return res.status(400).json({
      success: false,
      message: 'Impossible de supprimer cette catégorie car elle contient des produits.',
    });
  }

  await Category.remove(req.params.id);

  return success(
    res,
    null,
    'Category deleted successfully'
  );
});


module.exports = {
  getAll,
  getOne,
  store,
  update,
  destroy,
};
