
const express = require('express');
const router = express.Router();

const controller = require('../controllers/category.controller');
const {
  validateCategory,
} = require('../middlewares/validate.middleware');

// GET /api/categories
router.get('/', controller.getAll);

// GET /api/categories/:id
router.get('/:id', controller.getOne);

// POST /api/categories
router.post('/', validateCategory, controller.store);

// PUT /api/categories/:id
router.put('/:id', validateCategory, controller.update);

// DELETE /api/categories/:id
router.delete('/:id', controller.destroy);

module.exports = router;
