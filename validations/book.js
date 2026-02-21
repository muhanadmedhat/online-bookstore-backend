const Joi = require('joi');

const createBookSchema = Joi.object({
  name: Joi.string().min(3).max(30).required(),
  author: Joi.string().required(),
  categories: Joi.array().items(Joi.string()).min(1).required(),
  price: Joi.number().min(0).required(),
  stock: Joi.number().min(0).required().default(0),
  description: Joi.string().min(30).max(500).required()

});
const updateBookSchema = Joi.object({
  name: Joi.string().min(3).max(30),
  author: Joi.string(),
  categories: Joi.array().items(Joi.string()).min(1),
  price: Joi.number().min(0),
  stock: Joi.number().integer().min(0),
  description: Joi.string().min(30).max(500)
});

module.exports = {createBookSchema, updateBookSchema};
