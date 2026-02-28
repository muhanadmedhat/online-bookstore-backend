const Joi = require('joi');

const createCategorySchema = Joi.object({
  name: Joi.string().trim().min(2).max(50).required(),
  description: Joi.string().min(15).max(500).required()
});

const updateCategorySchema = Joi.object({
  name: Joi.string().trim().min(2).max(50),
  description: Joi.string().min(15).max(500).required()
}).min(1);

module.exports = {
  createCategorySchema,
  updateCategorySchema
};