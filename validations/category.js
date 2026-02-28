const Joi = require('joi');

const createCategorySchema = Joi.object({
  name: Joi.string().trim().min(2).max(50).required(),
  description: Joi.string().allow('').optional()
});

const updateCategorySchema = Joi.object({
  name: Joi.string().trim().min(2).max(50),
  description: Joi.string().allow('').optional()
}).min(1);

module.exports = {
  createCategorySchema,
  updateCategorySchema
};
