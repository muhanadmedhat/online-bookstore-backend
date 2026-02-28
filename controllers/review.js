const CustomError = require('../helpers/CustomError');
const syncAverageRating = require('../helpers/syncAverageRating');
const Review = require('../models/review');
const {getById} = require('./book');

async function get(id, queryParams) {
  try {
    const book = await getById(id);
    if (!book) throw new CustomError({statusCode: 404, message: 'Book not found', code: 'BOOK_NOT_FOUND'});
    const MAX_LIMIT = 50;
    const {limit, page} = queryParams;
    const safePage = Math.max(1, Number.parseInt(page) || 1);
    const safeLimit = Math.min(Number.parseInt(limit) || 10, MAX_LIMIT);
    const skip = (safePage - 1) * safeLimit;
    const filter = {};
    filter.book = book._id;
    const total = await Review.countDocuments(filter);
    const reviews = await Review.find(filter)
      .sort({createdAt: -1})
      .skip(skip)
      .limit(safeLimit)
      .populate('user', 'firstName');
    return {
      reviews,
      total,
      page: safePage,
      totalPages: Math.ceil(total / safeLimit)
    };
  } catch (error) {
    if (error instanceof CustomError) throw error;
    throw new CustomError({statusCode: 500, message: error.message, code: 'INTERNAL_SERVER_ERROR'});
  }
}
async function add(id, req) {
  try {
    const book = await getById(id);
    if (!book) throw new CustomError({statusCode: 404, message: 'Book not found', code: 'BOOK_NOT_FOUND'});
    const reviewData = {
      ...req.body,
      user: req.user.id,
      book: id
    };
    const review = await Review.create(reviewData);
    await syncAverageRating(id);
    return review;
  } catch (error) {
    if (error.name === 'ValidationError')
      throw new CustomError({statusCode: 422, message: error.message, code: 'REVIEW_VALIDATION_FAILED'});
    throw new CustomError({statusCode: 500, message: error.message, code: 'INTERNAL_SERVER_ERROR'});
  }
}

async function remove(id, userId) {
  try {
    const review = await Review.findOne({_id: id, user: userId});
    if (!review) throw new CustomError({statusCode: 404, message: 'Review not found or you are not authorized to delete it', code: 'REVIEW_NOT_FOUND_OR_FORBIDDEN'});
    const deleted = await Review.findByIdAndDelete(id);
    await syncAverageRating(deleted.book);
    return deleted;
  } catch (error) {
    if (error instanceof CustomError) throw error;
    throw new CustomError({statusCode: 500, message: error.message, code: 'INTERNAL_SERVER_ERROR'});
  }
}

async function adminRemove(id) {
  try {
    const deleted = await Review.findByIdAndDelete(id);
    if (!deleted) throw new CustomError({statusCode: 404, message: 'Review not found', code: 'REVIEW_NOT_FOUND'});
    await syncAverageRating(deleted.book);
    return deleted;
  } catch (error) {
    if (error instanceof CustomError) throw error;
    throw new CustomError({statusCode: 500, message: error.message, code: 'INTERNAL_SERVER_ERROR'});
  }
}
async function update(id, userId, updatedFields = {}) {
  try {
    const safeFields = {};
    Object.entries(updatedFields).forEach(([key, value]) => {
      if (key === 'comment' || key === 'rating') {
        safeFields[key] = value;
      }
    });
    if (!Object.keys(safeFields).length) throw new CustomError({statusCode: 400, message: 'No updates was found', code: 'UPDATES_NOT_FOUND'});
    const updated = await Review.findOneAndUpdate(
      {_id: id, user: userId},
      {$set: safeFields},
      {
        runValidators: true,
        returnDocument: 'after'
      }
    );
    if (!updated) {
      throw new CustomError({statusCode: 404, message: 'Review not found', code: 'REVIEW_NOT_FOUND'});
    }
    await syncAverageRating(updated.book);
    return updated;
  } catch (error) {
    if (error instanceof CustomError) throw error;
    if (error.name === 'ValidationError')
      throw new CustomError({statusCode: 422, message: error.message, code: 'REVIEW_VALIDATION_FAILED'});
    throw new CustomError({statusCode: 500, message: error.message, code: 'INTERNAL_SERVER_ERROR'});
  }
}
module.exports = {get, add, remove, adminRemove, update};
