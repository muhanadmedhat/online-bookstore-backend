const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;

const Joi = require('joi');
const {validateSchema} = require('../middlewares/');

const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({error: 'Authintication Required'});
    }
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({error: 'You don\'t have Permission.'});
    }
    next();
  };
};

const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : authHeader;
    if (!token) return res.status(401).json({error: 'Authentication token is required'});
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = {id: decoded.userId, role: decoded.role};
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({error: 'Token has expired'});
    }
    return res.status(401).json({error: 'Invalid or malformed token'});
  }
};

const userRegisterSchema = Joi.object({
  email: Joi.string()
    .email({tlds: false})
    .required()
    .messages({
      'string.email': 'Please provide a valid email address',
      'any.required': 'Email is required'
    }),

  password: Joi.string()
    .min(8)
    .max(50)
    .required()
    .messages({
      'string.min': 'Password must be at least 8 characters long',
      'string.max': 'Password must not exceed 50 characters',
      'any.required': 'Password is required'
    }),

  role: Joi.string()
    .optional(),

  firstName: Joi.string()
    .min(3)
    .max(15)
    .required()
    .messages({
      'string.min': 'First name must be at least 3 characters',
      'string.max': 'First name must not exceed 15 characters',
      'any.required': 'First name is required'
    }),

  lastName: Joi.string()
    .min(3)
    .max(15)
    .required()
    .messages({
      'string.min': 'Last name must be at least 3 characters',
      'string.max': 'Last name must not exceed 15 characters',
      'any.required': 'Last name is required'
    }),

  dob: Joi.date()
    .optional()
    .messages({
      'date.base': 'Date of birth must be a valid date'
    })
});

const userLoginSchema = Joi.object({
  email: Joi.string()
    .email({tlds: false})
    .required()
    .messages({
      'string.email': 'Please provide a valid email address',
      'any.required': 'Email is required'
    }),

  password: Joi.string()
    .min(8)
    .max(50)
    .required()
    .messages({
      'string.min': 'Password must be at least 8 characters long',
      'string.max': 'Password must not exceed 50 characters',
      'any.required': 'Password is required'
    })
});

const validateUserRegister = validateSchema(userRegisterSchema, 'body');
const validateUserLogin = validateSchema(userLoginSchema, 'body');

module.exports = {
  authorize,
  verifyToken,
  validateUserRegister,
  validateUserLogin
};
