const express = require('express');

const router = express.Router();
const {orderController} = require('../controllers');
const {validateSchema} = require('../middlewares/');
const {orderCreateSchema, statusOrderSchema, paymentOrderSchema} = require('../validations/order');
// User
router.post('/', validateSchema(orderCreateSchema), async (req, res) => {
  console.log(req.body);
  const {user, shippingAddress, paymentMethod} = req.body;
  const newOrder = await orderController.createOrder(user, shippingAddress, paymentMethod);
  res.json({
    message: 'Order placed successfully',
    order: newOrder
  });
});

// User
router.get('/', async (req, res) => {
  const {user} = req.body;
  const {page} = req.query;
  const {total, pages, userOrdersPaginated} = await orderController.getUserOrders(user, page);
  res.json({
    total,
    PagesNumber: pages,
    items: userOrdersPaginated
  });
});

// Admin
router.get('/admin/all', async (req, res) => {
  const {page, status, user} = req.query;
  const {total, pages, items} = await orderController.getAllOrders(page, status, user);
  res.json({
    total,
    pages,
    items
  });
});

// User or Admin
router.get('/:id', async (req, res) => {
  const {user} = req.body;
  const {id} = req.params;
  const order = await orderController.getSpecificOrder(user, id);
  res.json({order});
});

// Admin
router.patch('/:id/status', validateSchema(statusOrderSchema), async (req, res) => {
  const {id} = req.params;
  const {status} = req.body;
  const updatedOrder = await orderController.updateOrderStatus(id, status);
  res.json({
    message: 'Updated order status successfully',
    order: updatedOrder
  });
});

// Admin
router.patch('/:id/payment', validateSchema(paymentOrderSchema), async (req, res) => {
  const {id} = req.params;
  const {payment} = req.body;
  const updatedOrder = await orderController.updateOrderStatus(id, payment);
  res.json({
    message: 'Updated order payment status successfully',
    order: updatedOrder
  });
});

module.exports = router;
