const express = require('express');

const router = express.Router();

router.use('/authors', require('./author'));
router.use('/categories', require('./category'));

router.use('/books', require('./book'));

router.use('/reviews', require('./review'));
router.use('/cart', require('./cart'));
router.use('/orders', require('./order'));

router.use('/users', require('./users'));
router.use('/auth', require('./auth'));

router.use((req, res) => {
  res.status(404).json({error: 'Not Found'});
});
module.exports = router;
