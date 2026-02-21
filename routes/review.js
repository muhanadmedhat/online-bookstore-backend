const express = require('express');
const {reviewsController} = require('../controllers');
const {validateSchema, verifyToken, authorize} = require('../middlewares');
const valdiations = require('../validations/review');

const router = express.Router();

// GET

router.get('/book/:id', async (req, res) => {
  const {id} = req.params;
  const reviews = await reviewsController.get(id, req.query);
  res.json(reviews);
});

// POST

router.post('/book/:id', verifyToken, validateSchema(valdiations.createReviewSchema), async (req, res) => {
  const {id} = req.params;
  const review = await reviewsController.add(id, req);
  res.json(review);
});

// UPDATE

router.patch('/book/:id', verifyToken, validateSchema(valdiations.updateReviewSchema), async (req, res) => {
  const {id} = req.params;
  const {body} = req;
  const updated = await reviewsController.update(id, body);
  res.json(updated);
});

// DELETE

router.delete('/:id', verifyToken, async (req, res) => {
  const {id} = req.params;
  const deleted = await reviewsController.remove(id, req.user.id);
  res.json(deleted);
});

// DELETE BY ADMIN

router.delete('/:id/admin', verifyToken, authorize('admin'), async (req, res) => {
  const {id} = req.params;
  const deleted = await reviewsController.adminRemove(id);
  res.json(deleted);
});

module.exports = router;
