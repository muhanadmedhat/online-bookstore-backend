const CustomError = require('../helpers/CustomError');
const Review = require('../models/review');

async function get(queryParams) {
  try {
    const MAX_LIMIT = 50;
    const {book, limit, page} = queryParams;
    const safePage = Math.max(1, Number.parseInt(page) || 1);
    const safeLimit = Math.min(Number.parseInt(limit) || 10, MAX_LIMIT);
    const skip = (safePage - 1) * safeLimit;
    const filter = {};
    if (book) filter.book = book;
    const total = await Review.countDocuments(filter);
    const reviews = await Review.find(filter).skip(skip).limit(safeLimit);
    return {
      reviews,
      total,
      page: safePage,
      totalPages: Math.ceil(total / safeLimit)
    };
  } catch (error) {
    throw new CustomError({statusCode: 500, message: error.message, code: 'INTERNAL_SERVER_ERROR'});
  }
}
async function add(data) {
  try {
    return await Review.create(data);
  } catch (error) {
    if (error.name === 'ValidationError')
      throw new CustomError({statusCode: 422, message: error.message, code: 'REVIEW_VALIDATION_FAILED'});
    throw new CustomError({statusCode: 500, message: error.message, code: 'INTERNAL_SERVER_ERROR'});
  }
}
async function remove(id) {
  try {
    const deleted = await Review.findByIdAndDelete(id);
    if (!deleted) throw new CustomError({statusCode: 404, message: 'Review not found', code: 'REVIEW_NOT_FOUND'});
    return deleted;
  } catch (error) {
    if (error instanceof CustomError) throw error;
    throw new CustomError({statusCode: 500, message: error.message, code: 'INTERNAL_SERVER_ERROR'});
  }
}
async function update(id, updatedFields) {
  try {
    const updated = await Review.findByIdAndUpdate(
      id,
      {$set: updatedFields},
      {
        runValidators: true,
        returnDocument: 'after'
      }
    );
    if (!updated) {
      throw new CustomError({statusCode: 404, message: 'Review not found', code: 'REVIEW_NOT_FOUND'});
    }
    return updated;
  } catch (error) {
    if (error instanceof CustomError) throw error;

    throw new CustomError({statusCode: 500, message: error.message, code: 'INTERNAL_SERVER_ERROR'});
  }
}
module.exports = {get, add, remove, update};
