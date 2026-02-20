const Joi = require('joi');

const createReviewSchema = Joi.object({
  user: Joi.string().required(),
  book: Joi.string().required(),
  rating: Joi.number().min(1).max(5).required(),
  comment: Joi.string().max(500)
});
const updateReviewSchema = Joi.object({
  rating: Joi.number().min(1).max(5),
  comment: Joi.string().max(500)
}).min(1);
module.exports = {createReviewSchema, updateReviewSchema};
