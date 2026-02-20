const Joi = require('joi');
const {validate} = require('./validate');

const userUpdateProfileSchema = Joi.object({});

const userUpdatePasswordSchema = Joi.object({});

const validateUserProfileUpdate = validate(userUpdateProfileSchema, 'body');

const validateUserPasswordUpdate = validate(userUpdatePasswordSchema, 'body');

module.exports = {
    validateUserProfileUpdate,
    validateUserPasswordUpdate
};