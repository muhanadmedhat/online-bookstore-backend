const express = require('express');
const {cartController} = require('../controllers');
const {validateSchema, verifyToken, authorize} = require('../middlewares/');
const cartSchema = require('../validations/cart');

const router = express.Router();

/**
 * @swagger
 * /cart:
 *   get:
 *     summary: Get the current user's cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User's cart data
 *       401:
 *         description: Authentication required
 */
router.get('/', verifyToken, authorize('user'), async (req, res, next) => {
  try {
    const user = req.user.id;
    const userCart = await cartController.getUserCart(user);
    res.json({userCart});
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /cart:
 *   post:
 *     summary: Add items to the cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - items
 *             properties:
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     bookId:
 *                       type: string
 *                     quantity:
 *                       type: integer
 *                       default: 1
 *     responses:
 *       201:
 *         description: Item added in cart successfully
 *       401:
 *         description: Authentication required
 */
router.post('/', verifyToken, authorize('user'), async (req, res, next) => {
  try {
    const user = req.user.id;
    const {items} = req.body;
    const cart = await cartController.addUserCart(user, items);
    res.status(201).json({
      message: 'Item added in cart successfully',
      cart
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /cart/{bookId}:
 *   patch:
 *     summary: Update the quantity of a book in the cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: bookId
 *         required: true
 *         schema:
 *           type: string
 *         description: Book ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - quantity
 *             properties:
 *               quantity:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Item updated successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Authentication required
 */
router.patch('/:bookId', verifyToken, authorize('user'), validateSchema(cartSchema), async (req, res, next) => {
  try {
    const user = req.user.id;
    const {bookId} = req.params;
    const {quantity} = req.body;
    const updatedBook = await cartController.updateBookQuantity(user, bookId, quantity);
    res.json({
      message: 'Item updated successfully',
      item: updatedBook
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /cart/{bookId}:
 *   delete:
 *     summary: Remove a book from the cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: bookId
 *         required: true
 *         schema:
 *           type: string
 *         description: Book ID
 *     responses:
 *       200:
 *         description: Book removed from cart successfully
 *       401:
 *         description: Authentication required
 */
router.delete('/:bookId', verifyToken, authorize('user'), async (req, res, next) => {
  try {
    const user = req.user.id;
    const {bookId} = req.params;
    const deletedBook = await cartController.deleteUserBook(user, bookId);
    res.json({
      message: 'Book removed from cart successfully',
      item: deletedBook
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /cart:
 *   delete:
 *     summary: Clear the entire cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cart removed successfully
 *       401:
 *         description: Authentication required
 */
router.delete('/', verifyToken, authorize('user'), async (req, res, next) => {
  try {
    const user = req.user.id;
    const deletedCart = await cartController.deleteUserCart(user);
    res.json({
      message: 'Cart removed successfully',
      cart: deletedCart
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
