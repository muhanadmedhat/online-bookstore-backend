const express = require('express');
const {booksController} = require('../controllers');
const {validateSchema, uploadCover, verifyToken, authorize} = require('../middlewares/');
const validations = require('../validations/book');

const router = express.Router();

// GET

/**
 * @swagger
 * /books:
 *   get:
 *     summary: Get a list of books with optional filtering and pagination
 *     tags: [Books]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of items per page
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter by category ID
 *       - in: query
 *         name: author
 *         schema:
 *           type: string
 *         description: Filter by author ID
 *     responses:
 *       200:
 *         description: A list of books
 */
router.get('/', async (req, res) => {
  const books = await booksController.get(req.query);
  res.json(books);
});

router.get('/suggestions', async (req, res) => {
  const bookTitles = await booksController.getSuggestions(req.query);
  res.json(bookTitles);
});

// GET POPULAR

/**
 * @swagger
 * /books/popular:
 *   get:
 *     summary: Get a list of popular books
 *     tags: [Books]
 *     responses:
 *       200:
 *         description: A list of popular books
 */
router.get('/popular', async (req, res) => {
  const popular = await booksController.getPopular();
  res.json(popular);
});

// GET BY ID

/**
 * @swagger
 * /books/{id}:
 *   get:
 *     summary: Get a specific book by ID
 *     tags: [Books]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Book ID
 *     responses:
 *       200:
 *         description: The book data
 *       404:
 *         description: Book not found
 */
router.get('/:id', async (req, res) => {
  const {id} = req.params;
  const book = await booksController.getById(id);
  res.json(book);
});

// POST

/**
 * @swagger
 * /books:
 *   post:
 *     summary: Create a new book
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - author
 *               - categories
 *               - price
 *               - description
 *             properties:
 *               name:
 *                 type: string
 *               author:
 *                 type: string
 *                 description: Author ID
 *               categories:
 *                 type: string
 *                 description: Category ID (Swagger UI has a known bug with arrays in multipart/form-data. Send a single string ID here for testing.)
 *               price:
 *                 type: number
 *               stock:
 *                 type: number
 *                 description: Initial stock quantity
 *                 default: 0
 *               description:
 *                 type: string
 *               coverImage:
 *                 type: string
 *                 format: binary
 *                 description: The book cover image
 *     responses:
 *       201:
 *         description: Book created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Permission denied (Admin only)
 */
router.post('/', verifyToken, authorize('admin'), uploadCover, validateSchema(validations.createBookSchema), async (req, res) => {
  console.log('Body:', req.body);
  console.log('File:', req.file);
  const book = await booksController.add(req);
  res.status(201).json(book);
});

// PATCH

/**
 * @swagger
 * /books/{id}:
 *   patch:
 *     summary: Update an existing book
 *     tags: [Books]
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
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               author:
 *                 type: string
 *               categories:
 *                 type: string
 *                 description: Category ID (Swagger UI has a known bug with arrays in multipart/form-data. Send a single string ID here for testing.)
 *               price:
 *                 type: number
 *               stock:
 *                 type: number
 *               description:
 *                 type: string
 *               coverImage:
 *                 type: string
 *                 format: binary
 *                 description: Optional new book cover image
 *     responses:
 *       200:
 *         description: Book updated successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Permission denied (Admin only)
 */
router.patch('/:id', verifyToken, authorize('admin'), uploadCover, validateSchema(validations.updateBookSchema), async (req, res) => {
  const {id} = req.params;
  const updatedBook = await booksController.update(id, req);
  res.json(updatedBook);
});

// DELETE

/**
 * @swagger
 * /books/{id}:
 *   delete:
 *     summary: Soft delete a book
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Book ID
 *     responses:
 *       200:
 *         description: Book deleted successfully
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Permission denied (Admin only)
 *       404:
 *         description: Book not found
 */
router.delete('/:id', verifyToken, authorize('admin'), async (req, res) => {
  const {id} = req.params;
  const updatedBook = await booksController.softDelete(id);
  res.json(updatedBook);
});

module.exports = router;
