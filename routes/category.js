const router = require('express').Router();
const categoryController = require('../controllers/category');
const validate = require('../middlewares/validate');
const {createCategorySchema, updateCategorySchema} = require('../validations/category');

router.get('/', categoryController.getAllCategories);

router.get('/:id', categoryController.getCategoryById);

router.post(
  '/',
  validate(createCategorySchema),
  categoryController.createCategory
);

router.put(
  '/:id',
  validate(updateCategorySchema),
  categoryController.updateCategory
);

router.delete('/:id', categoryController.deleteCategory);

module.exports = router;
