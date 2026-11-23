
const Joi = require('joi');

// Product validation
const productSchema = Joi.object({
  category_id: Joi.number().integer().positive().allow(null),
  name: Joi.string().max(150).required(),
  description: Joi.string().allow(null, ''),
  price: Joi.number().min(0).precision(2).required(),
  stock: Joi.number().integer().min(0).default(0),
  sku: Joi.string().max(50).allow(null, ''),
  image_url: Joi.string().uri().max(255).allow(null, ''),
  is_active: Joi.number().valid(0, 1).default(1),
});

const productUpdateSchema = productSchema.fork(
  ['name', 'price'],
  (field) => field.optional()
);

// Category validation
const categorySchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
});

// Generic validation middleware
const validate = (schema) => (req, res, next) => {
  const { error, value } = schema.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      errors: error.details.map((d) => d.message),
    });
  }

  req.body = value;
  next();
};

module.exports = {
  validateCreate: validate(productSchema),
  validateUpdate: validate(productUpdateSchema),
  validateCategory: validate(categorySchema),
};
