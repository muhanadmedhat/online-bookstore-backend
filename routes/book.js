const express = require('express');
const {booksController} = require('../controllers');
const {validateSchema, uploadCover, verifyToken, authorize} = require('../middlewares/');
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

// GET BY ID

router.get('/:id', async (req, res) => {
  const {id} = req.params;
  const book = await booksController.getById(id);
  res.json(book);
});

// POST

router.post('/', verifyToken, authorize('admin'), uploadCover, validateSchema(validations.createBookSchema), async (req, res) => {
  const book = await booksController.add(req);
  res.status(201).json(book);
});

// PATCH

router.patch('/:id', verifyToken, authorize('admin'), uploadCover, validateSchema(validations.updateBookSchema), async (req, res) => {
  const {id} = req.params;
  const updatedBook = await booksController.update(id, req);
  res.json(updatedBook);
});

// DELETE

router.delete('/:id', verifyToken, authorize('admin'), async (req, res) => {
  const {id} = req.params;
  const updatedBook = await booksController.softDelete(id);
  res.json(updatedBook);
});

module.exports = router;
