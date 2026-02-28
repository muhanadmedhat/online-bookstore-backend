const Joi = require('joi');

const createAuthorSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  bio: Joi.string().max(2000).allow('').optional()
});

const updateAuthorSchema = Joi.object({
  name: Joi.string().min(2).max(100).optional(),
  bio: Joi.string().max(2000).allow('').optional()
});

module.exports = {
  createAuthorSchema,
  updateAuthorSchema
};
