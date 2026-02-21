const express = require('express');

const router = express.Router();

router.use('/cart', require('./cart'));
router.use('/orders', require('./order'));
router.use((req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

module.exports = router;