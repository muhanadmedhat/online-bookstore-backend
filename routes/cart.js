const express = require('express');
const {cartController} = require('../controllers');
const {validateSchema} = require('../middlewares/');
const cartSchema = require('../validations/cart');

const router = express.Router();

// add auth middleware
router.get('/', async (req, res) => {
  const {user} = req.body;
  const userCart = await cartController.getUserCart(user);
  res.json({userCart});
});

router.post('/', async (req, res) => {
  const {user, items} = req.body;
  const cart = await cartController.addUserCart(user, items);
  res.status(201).json({
    message: 'Item added in cart successfully',
    item: cart
  });
});

router.patch('/:bookId', validateSchema(cartSchema), async (req, res) => {
  const {bookId} = req.params;
  const {user, quantity} = req.body;
  const updatedBook = await cartController.updateBookQuantity(user, bookId, quantity);
  res.json({
    message: 'Item updated successfully',
    item: updatedBook
  });
});

router.delete('/:bookId', async (req, res) => {
  const {bookId} = req.params;
  const {user} = req.body;
  const deletedBook = await cartController.deleteUserBook(user, bookId);
  res.json({
    message: 'Book removed from cart successfully'
  });
});

router.delete('/', async (req, res) => {
  const {user} = req.body;
  const deletedCart = await cartController.deleteUserCart(user);
  res.json({
    message: 'Cart removed successfully'
  });
});

module.exports = router;
