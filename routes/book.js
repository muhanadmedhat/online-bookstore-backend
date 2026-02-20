const express = require('express');
const {booksController} = require('../controllers');
const {validateSchema} = require('../middlewares/');
const validations = require('../validations/book');

const router = express.Router();

// GET

router.get('/', async (req, res) => {
  const books = await booksController.get(req.query);
  res.json(books);
});

// GET POPULAR

router.get('/popular', async (req, res) => {
  const popular = await booksController.getPopular();
  res.json(popular);
});

// GET BOOK REVIEWS
router.get('/:id/reviews', async (req, res) => {
  const {id} = req.params;
  const reviews = await booksController.getBookReviews(id);
  res.json(reviews);
});

// GET BY ID

router.get('/:id', async (req, res) => {
  const {id} = req.params;
  const book = await booksController.getById(id);
  res.json(book);
});

// POST

router.post('/', validateSchema(validations.createBookSchema),async (req, res) => {
  const {body} = req;
  const book = await booksController.add(body);
  res.status(201).json(book);
});

// PATCH

router.patch('/:id', validateSchema(validations.updateBookSchema), async (req, res) => {
  const {body} = req;
  const {id} = req.params;
  const updatedBook = await booksController.update(id, body);
  res.json(updatedBook);
});

// DELETE

router.delete('/:id', async (req, res) => {
  const {id} = req.params;
  const updatedBook = await booksController.softDelete(id);
  res.json(updatedBook);
});

// DELETE

// router.delete('/:id', async (req, res) => {
//   const {id} = req.params;
//   const deletedBook = await bookController.remove(id);
//   res.json(deletedBook);
// });
module.exports = router;
