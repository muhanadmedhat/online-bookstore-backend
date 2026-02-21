const express = require('express');
const { cartController } = require('../controllers');
const { validateSchema, verifyToken, authorize } = require('../middlewares/');
const cartSchema = require('../validations/cart');

const router = express.Router();

// add auth middleware
router.get('/', verifyToken, authorize('user'), async (req, res, next) => {
  try {
    const user = req.user.id;
    const userCart = await cartController.getUserCart(user);
    res.json({ userCart });
  } catch (error) {
    next(error);
  }
});

router.post('/', verifyToken, authorize('user'), async (req, res, next) => {
  try {
    const user = req.user.id;
    const { items } = req.body;
    const cart = await cartController.addUserCart(user, items);
    res.status(201).json({
      message: 'Item added in cart successfully',
      cart: cart
    });
  } catch (error) {
    next(error);
  }
});

router.patch('/:bookId', verifyToken, authorize('user'), validateSchema(cartSchema), async (req, res, next) => {
  try {
    const user = req.user.id;
    const { bookId } = req.params;
    const { quantity } = req.body;
    const updatedBook = await cartController.updateBookQuantity(user, bookId, quantity);
    res.json({
      message: 'Item updated successfully',
      item: updatedBook
    });
  } catch (error) {
    next(error);
  }
});

router.delete('/:bookId', verifyToken, authorize('user'), async (req, res, next) => {
  try {
    const user = req.user.id;
    const { bookId } = req.params;
    const deletedBook = await cartController.deleteUserBook(user, bookId);
    res.json({
      message: 'Book removed from cart successfully',
      item: deletedBook
    });
  } catch (error) {
    next(error);
  }
});

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
