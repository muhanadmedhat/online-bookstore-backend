const joi = require('joi');

const orderCreateSchema = joi.object({
  payment_method: joi.string().valid('COD', 'online'),
  shipping_address: joi.object({
    street: joi.string().required().min(3).max(20),
    city: joi.string().required().min(3).max(20),
    state: joi.string().required().min(3).max(20),
    zip: joi.string().required().min(3).max(20),
    country: joi.string().required().min(3).max(20),
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