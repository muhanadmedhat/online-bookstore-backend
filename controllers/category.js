const mongoose = require('mongoose');
const CustomError = require('../helpers/CustomError');
const Category = require('../models/category');

exports.getAllCategories = async (req, res, next) => {
  try {
    const page = Math.max(Number.parseInt(req.query.page || '1', 10), 1);
    const limit = Math.min(Math.max(Number.parseInt(req.query.limit || '10', 10), 1), 100);
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      Category.find().sort({createdAt: -1}).skip(skip).limit(limit),
      Category.countDocuments()
    ]);

    res.json({
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      items
    });
  } catch (err) {
    next(err);
  }
};

exports.getCategoryById = async (req, res, next) => {
  try {
    const {id} = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({message: 'Invalid category id'});
    }

    const category = await Category.findById(id);
    if (!category) return res.status(404).json({message: 'Category not found'});

    res.json(category);
  } catch (err) {
    next(err);
  }
};

exports.createCategory = async (req, res, next) => {
  try {
    const categoryData = req.body;
    const categoryImage = req.file?.path;
    if (!categoryImage) throw new CustomError({statusCode: 400, message: 'No Category Image', code: 'CATEGORY_IMAGE_REQUIRED'});
    const createdCategory = await Category.create({...categoryData, categoryImage});
    res.status(201).json(createdCategory);
  } catch (err) {
    next(err);
  }
};

exports.updateCategory = async (req, res, next) => {
  try {
    const {id} = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({message: 'Invalid category id'});
    }

    const updatedFields = req.body;
    const categoryImage = req.file?.path;
    if (Object.keys(updatedFields).length === 0 && !categoryImage)
      throw new CustomError({statusCode: 400, message: 'At least one field must be provided', code: 'NO_FIELDS_PROVIDED'});
    if (categoryImage) updatedFields.categoryImage = categoryImage;

    const updated = await Category.findByIdAndUpdate(id, {$set: updatedFields}, {
      new: true,
      runValidators: true
    });

    if (!updated) return res.status(404).json({message: 'Category not found'});

    res.json(updated);
  } catch (err) {
    next(err);
  }
};

exports.deleteCategory = async (req, res, next) => {
  try {
    const {id} = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({message: 'Invalid category id'});
    }

    const deleted = await Category.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({message: 'Category not found'});

    res.json({message: 'Category deleted successfully'});
  } catch (err) {
    next(err);
  }
};
