const joi = require('joi');

const cartSchema = joi.object({
  quantity: joi.number().integer().min(0).required()
});

const cartAddSchema = joi.object({
  book: joi.string().hex().length(24).required(),
  quantity: joi.number().integer().min(1).required()
});

module.exports = {
  cartSchema,
  cartAddSchema
};
