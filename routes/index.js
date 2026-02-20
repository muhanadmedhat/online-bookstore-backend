const express = require('express');

const router = express.Router();

router.use('/authors', require('./author'));
router.use('/categories', require('./category'));

router.use('/books', require('./book'));

router.use('/reviews', require('./review'));

router.use('/users', require('./users'));
router.use('/auth', require('./auth'));

module.exports = router;
