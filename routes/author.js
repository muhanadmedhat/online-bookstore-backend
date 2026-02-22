const router = require('express').Router();
const authorController = require('../controllers/author');
const {verifyToken, authorize, validateSchema} = require('../middlewares/');
const {createAuthorSchema, updateAuthorSchema} = require('../validations/author');

/**
 * @swagger
 * /authors:
 *   get:
 *     summary: Get all authors
 *     tags: [Authors]
 *     responses:
 *       200:
 *         description: A list of authors
 */
router.get('/', authorController.getAllAuthors);
/**
 * @swagger
 * /authors/{id}:
 *   get:
 *     summary: Get an author by ID
 *     tags: [Authors]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Author ID
 *     responses:
 *       200:
 *         description: The author data
 *       404:
 *         description: Author not found
 */
router.get('/:id', authorController.getAuthorById);

/**
 * @swagger
 * /authors:
 *   post:
 *     summary: Create a new author
 *     tags: [Authors]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *               bio:
 *                 type: string
 *     responses:
 *       201:
 *         description: Author created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Permission denied (Admin only)
 */
router.post('/', verifyToken, authorize('admin'), validateSchema(createAuthorSchema), authorController.createAuthor);

/**
 * @swagger
 * /authors/{id}:
 *   patch:
 *     summary: Update an existing author
 *     tags: [Authors]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Author ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               bio:
 *                 type: string
 *     responses:
 *       200:
 *         description: Author updated successfully
 *       404:
 *         description: Author not found
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Permission denied (Admin only)
 */
router.patch('/:id', verifyToken, authorize('admin'), validateSchema(updateAuthorSchema), authorController.updateAuthor);

/**
 * @swagger
 * /authors/{id}:
 *   delete:
 *     summary: Delete an author
 *     tags: [Authors]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Author ID
 *     responses:
 *       200:
 *         description: Author deleted successfully
 *       404:
 *         description: Author not found
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Permission denied (Admin only)
 */
router.delete('/:id', verifyToken, authorize('admin'), authorController.deleteAuthor);

module.exports = router;
