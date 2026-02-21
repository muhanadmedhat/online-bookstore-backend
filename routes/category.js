const router = require('express').Router();
const categoryController = require('../controllers/category');
const {verifyToken, authorize, validateSchema} = require('../middlewares/');
const {createCategorySchema, updateCategorySchema} = require('../validations/category');

router.get('/', categoryController.getAllCategories);

router.get('/:id', categoryController.getCategoryById);

router.post('/', verifyToken, authorize('admin'), validateSchema(createCategorySchema), categoryController.createCategory);

router.put('/:id', verifyToken, authorize('admin'), validateSchema(updateCategorySchema), categoryController.updateCategory);

router.delete('/:id', verifyToken, authorize('admin'), categoryController.deleteCategory);

module.exports = router;
