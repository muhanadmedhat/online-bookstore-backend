const joi = require('joi');
const CustomError = require('../helpers/CustomError.js');
const cartSchema = joi.object({
  quantity: joi.number().integer().min(0).required()
});

function cartValidation(req, res, next) {
  const { error } = cartSchema.validate(req.body);
  if (error) {
    return next(new CustomError({ statusCode: 400, code: 'NEGATIVE_QUANTITY', message: error.details[0].message }));
  }
  next();
}

module.exports = cartValidation;