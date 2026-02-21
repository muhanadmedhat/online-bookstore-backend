const CustomError = require('../helpers/CustomError');

function validate(schema) {
  return function (req, res, next) {
    const { error } = schema.validate(req.body);
    if (error) return next(new CustomError({ statusCode: 400, message: error.message, code: 'VALIDATION_FAILED' }));
    next();
  };
}

module.exports = validate;