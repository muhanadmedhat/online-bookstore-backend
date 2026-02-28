const express = require('express');
const {reviewsController} = require('../controllers');
const {validateSchema, verifyToken, authorize} = require('../middlewares');
const valdiations = require('../validations/review');

const router = express.Router();

// GET

/**
 * @swagger
 * /reviews/book/{id}:
 *   get:
 *     summary: Get reviews for a specific book
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Book ID
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: A list of reviews for the book
 */
router.get('/book/:id', async (req, res) => {
  const {id} = req.params;
  const reviews = await reviewsController.get(id, req.query);
  res.json(reviews);
});

// POST

/**
 * @swagger
 * /reviews/book/{id}:
 *   post:
 *     summary: Add a review to a book
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
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
 *               - rating
 *             properties:
 *               rating:
 *                 type: number
 *                 minimum: 1
 *                 maximum: 5
 *               comment:
 *                 type: string
 *     responses:
 *       201:
 *         description: Review added successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Authentication required
 */
router.post('/book/:id', verifyToken, validateSchema(valdiations.createReviewSchema), async (req, res) => {
  const {id} = req.params;
  const review = await reviewsController.add(id, req);
  res.json(review);
});

// UPDATE

/**
 * @swagger
 * /reviews/book/{id}:
 *   patch:
 *     summary: Update an existing review
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Review ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               rating:
 *                 type: number
 *                 minimum: 1
 *                 maximum: 5
 *               comment:
 *                 type: string
 *     responses:
 *       200:
 *         description: Review updated successfully
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Permission denied (Not the owner)
 */
router.patch('/book/:id', verifyToken, validateSchema(valdiations.updateReviewSchema), async (req, res) => {
  const {id} = req.params;
  const {body} = req;
  const updated = await reviewsController.update(id, body);
  res.json(updated);
});

// DELETE

/**
 * @swagger
 * /reviews/{id}:
 *   delete:
 *     summary: Delete your own review
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Review ID
 *     responses:
 *       200:
 *         description: Review deleted successfully
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Permission denied (Not the owner)
 */
router.delete('/:id', verifyToken, async (req, res) => {
  const {id} = req.params;
  const deleted = await reviewsController.remove(id, req.user.id);
  res.json(deleted);
});

// DELETE BY ADMIN

/**
 * @swagger
 * /reviews/{id}/admin:
 *   delete:
 *     summary: Delete any user's review (Admin only)
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Review ID
 *     responses:
 *       200:
 *         description: Review deleted successfully
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Permission denied (Admin only)
 */
router.delete('/:id/admin', verifyToken, authorize('admin'), async (req, res) => {
  const {id} = req.params;
  const deleted = await reviewsController.adminRemove(id);
  res.json(deleted);
});

module.exports = router;
