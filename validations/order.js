const joi = require('joi');

const orderCreateSchema = joi.object({
  user: joi.string(),
  paymentMethod: joi.string().valid('COD', 'online'),
  shippingAddress: joi.object({
    street: joi.string().min(3).max(100),
    city: joi.string().min(2).max(50),
    state: joi.string().min(2).max(50),
    zip: joi.string().min(3).max(20),
    country: joi.string().min(2).max(50)
  }).required()
});

const statusOrderSchema = joi.object({
  status: joi.string().valid('processing', 'out_for_delivery', 'delivered')
});

const paymentOrderSchema = joi.object({
  payment_status: joi.string().valid('pending', 'success')
});

module.exports = {
  orderCreateSchema,
  statusOrderSchema,
  paymentOrderSchema
};
