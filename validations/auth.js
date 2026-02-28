const Joi = require('joi');

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

module.exports = {userRegisterSchema, userLoginSchema};
