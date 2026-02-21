const express = require('express');

const router = express.Router();
const {orderController} = require('../controllers');
const {validateSchema, verifyToken, authorize} = require('../middlewares/');
const {orderCreateSchema, statusOrderSchema, paymentOrderSchema} = require('../validations/order');
// User
router.post('/', verifyToken, authorize('user'), validateSchema(orderCreateSchema), async (req, res, next) => {
  try {
    const user = req.user.id;
    const {shippingAddress, paymentMethod} = req.body;
    const newOrder = await orderController.createOrder(user, shippingAddress, paymentMethod);
    res.json({
      message: 'Order placed successfully',
      order: newOrder
    });
  } catch (error) {
    next(error);
  }
});

// User
router.get('/', verifyToken, authorize('user'), async (req, res, next) => {
  try {
    const user = req.user.id;
    const {page} = req.query;
    const {total, pages, userOrdersPaginated} = await orderController.getUserOrders(user, page);
    res.json({
      total,
      PagesNumber: pages,
      items: userOrdersPaginated
    });
  } catch (error) {
    next(error);
  }
});

// Admin
router.get('/admin/all', verifyToken, authorize('admin'), async (req, res, next) => {
  try {
    const {page, status, user} = req.query;
    const {total, pages, items} = await orderController.getAllOrders(page, status, user);
    res.json({
      total,
      pages,
      items
    });
  } catch (error) {
    next(error);
  }
});

// User or Admin
router.get('/:id', verifyToken, authorize('user', 'admin'), async (req, res, next) => {
  try {
    const user = req.user;
    const {id} = req.params;
    const order = await orderController.getSpecificOrder(user, id);
    res.json({order});
  } catch (error) {
    next(error);
  }
});

// Admin
router.patch('/:id/status', verifyToken, authorize('admin'), validateSchema(statusOrderSchema), async (req, res, next) => {
  try {
    const {id} = req.params;
    const {status} = req.body;
    const updatedOrder = await orderController.updateOrderStatus(id, status);
    res.json({
      message: 'Updated order status successfully',
      order: updatedOrder
    });
  } catch (error) {
    next(error);
  }
});

// Admin
router.patch('/:id/payment', verifyToken, authorize('admin'), validateSchema(paymentOrderSchema), async (req, res, next) => {
  try {
    const {id} = req.params;
    const {payment} = req.body;
    const updatedOrder = await orderController.updateOrderPayment(id, payment);
    res.json({
      message: 'Updated order payment status successfully',
      order: updatedOrder
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
