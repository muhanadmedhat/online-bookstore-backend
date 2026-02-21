const joi = require('joi');
const cartSchema = joi.object({
  quantity: joi.number().integer().min(0).required()
});

module.exports = cartSchema;