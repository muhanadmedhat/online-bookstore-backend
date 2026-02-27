const express = require('express');

const router = express.Router();
const {orderController} = require('../controllers');
const {validateSchema, verifyToken, authorize} = require('../middlewares/');
const {orderCreateSchema, statusOrderSchema, paymentOrderSchema} = require('../validations/order');
// User
/**
 * @swagger
 * /orders:
 *   post:
 *     summary: Place a new order
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - shippingAddress
 *               - paymentMethod
 *             properties:
 *               shippingAddress:
 *                 type: string
 *               paymentMethod:
 *                 type: string
 *                 enum: [cash, card]
 *     responses:
 *       201:
 *         description: Order placed successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Authentication required
 */
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
/**
 * @swagger
 * /orders:
 *   get:
 *     summary: Get the current user's orders
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: A paginated list of user orders
 *       401:
 *         description: Authentication required
 */
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
/**
 * @swagger
 * /orders/admin/all:
 *   get:
 *     summary: Get all orders across all users (Admin only)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *         description: Filter orders by status
 *       - in: query
 *         name: user
 *         schema:
 *           type: string
 *         description: Filter orders by user ID
 *     responses:
 *       200:
 *         description: A paginated list of all orders
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Permission denied (Admin only)
 */
router.get('/admin/all', verifyToken, authorize('admin'), async (req, res, next) => {
  try {
    const {page, status, user} = req.query;
    const {total, pages, orderSent} = await orderController.getAllOrders(page, status, user);
    res.json({
      total,
      pages,
      orders: orderSent
    });
  } catch (error) {
    next(error);
  }
});

// User or Admin
/**
 * @swagger
 * /orders/{id}:
 *   get:
 *     summary: Get a specific order's details
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Order ID
 *     responses:
 *       200:
 *         description: Specific order details
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Permission denied
 *       404:
 *         description: Order not found
 */
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
/**
 * @swagger
 * /orders/{id}/status:
 *   patch:
 *     summary: Update the delivery status of an order (Admin only)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Order ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *     responses:
 *       200:
 *         description: Updated order status successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Permission denied (Admin only)
 */
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
/**
 * @swagger
 * /orders/{id}/payment:
 *   patch:
 *     summary: Update the payment status of an order (Admin only)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Order ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - payment
 *             properties:
 *               payment:
 *                 type: string
 *     responses:
 *       200:
 *         description: Updated order payment status successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Permission denied (Admin only)
 */
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
