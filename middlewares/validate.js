const CustomError = require('../helpers/CustomError');

function validate(schema) {
  return function (req, res, next) {
    const {error, value} = schema.validate(req.body);
    if (error) return next(new CustomError({statusCode: 400, message: error.message, code: 'VALIDATION_FAILED'}));
    req.body = value;
    next();
  };
}

module.exports = validate;
