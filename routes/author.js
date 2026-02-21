const router = require('express').Router();
const authorController = require('../controllers/author');
const {verifyToken, authorize, validateSchema} = require('../middlewares/');
const {createAuthorSchema, updateAuthorSchema} = require('../validations/author');

router.get('/', authorController.getAllAuthors);
router.get('/:id', authorController.getAuthorById);

router.post('/', verifyToken, authorize('admin'), validateSchema(createAuthorSchema), authorController.createAuthor);

router.patch('/:id', verifyToken, authorize('admin'), validateSchema(updateAuthorSchema), authorController.updateAuthor);

router.delete('/:id', verifyToken, authorize('admin'), authorController.deleteAuthor);

module.exports = router;
