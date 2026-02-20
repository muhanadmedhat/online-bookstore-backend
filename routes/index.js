const express = require('express');

const router = express.Router();

router.use('/books', require('./book'));

router.use('/reviews', require('./review'));

router.use((req, res) => {
  res.status(404).json({error: 'Not Found'});
});

module.exports = router;
