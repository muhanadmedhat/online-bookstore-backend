const express = require('express');
const {reviewsController} = require('../controllers');
const {validateSchema} = require('../middlewares');
const valdiations = require('../validations/review');

const router = express.Router();

// GET

router.get('/', async (req, res) => {
  const reviews = await reviewsController.get();
  res.json(reviews);
});

// POST

router.post('/', validateSchema(valdiations.createReviewSchema), async (req, res) => {
  const {body} = req;
  const review = await reviewsController.add(body);
  res.json(review);
});

// UPDATE

router.patch('/:id', validateSchema(valdiations.updateReviewSchema), async (req, res) => {
  const {id} = req.params;
  const {body} = req;
  const updated = await reviewsController.update(id, body);
  res.json(updated);
});

// DELETE

router.delete('/:id', async (req, res) => {
  const {id} = req.params;
  const deleted = await reviewsController.remove(id);
  res.json(deleted);
});

module.exports = router;
