const Joi = require('joi');
const { validate } = require('../middlewares/validate');

const userUpdateProfileSchema = Joi.object({
    email: Joi.string()
        .email({ tlds: false })
        .optional()
        .messages({
            'string.email': 'Please provide a valid email address',
            'any.required': 'Email is required'
        }),
    firstName: Joi.string()
        .min(3)
        .max(15)
        .optional()
        .messages({
            'string.min': 'First name must be at least 3 characters',
            'string.max': 'First name must not exceed 15 characters'
        }),
    lastName: Joi.string()
        .min(3)
        .max(15)
        .optional()
        .messages({
            'string.min': 'First name must be at least 3 characters',
            'string.max': 'First name must not exceed 15 characters'
        }),
    dob: Joi.date()
        .optional()
        .messages({
            'date.base': 'Date of birth must be a valid date'
        })
}).min(1).messages({
    'object.min': 'At least one field must be provided for update'
});

const userUpdatePasswordSchema = Joi.object({
    currentPassword: Joi.string()
        .min(8)
        .max(50)
        .required()
        .messages({
            'string.min': 'Password must be at least 8 characters long',
            'string.max': 'Password must not exceed 50 characters',
            'any.required': 'Current Password is required'
        }),
    newPassword: Joi.string()
        .min(8)
        .max(50)
        .required()
        .messages({
            'string.min': 'Password must be at least 8 characters long',
            'string.max': 'Password must not exceed 50 characters',
            'any.required': 'New Password is required'
        })
});

const validateUserProfileUpdate = validate(userUpdateProfileSchema, 'body');

const validateUserPasswordUpdate = validate(userUpdatePasswordSchema, 'body');

module.exports = {
    validateUserProfileUpdate,
    validateUserPasswordUpdate
};