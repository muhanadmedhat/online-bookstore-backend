const CustomError = require('../helpers/CustomError');
const Book = require('../models/book');

async function get(queryParams) {
  try {
    const MAX_LIMIT = 50;
    const {category, author, minPrice, maxPrice, search, limit, page} = queryParams;
    const safePage = Math.max(Number.parseInt(page) || 1, 1);
    const safeLimit = Math.min(Number.parseInt(limit) || 10, MAX_LIMIT);
    const skip = (safePage - 1) * safeLimit;
    const filter = {};
    if (category)
      filter.category = category;
    if (author)
      filter.author = author;
    if (minPrice || maxPrice)
      filter.price = {};
    if (minPrice) filter.price.$gte = Number(minPrice);
    if (maxPrice) filter.price.$lte = Number(maxPrice);
    if (search) filter.$text = {$search: search};
    const total = await Book.countDocuments(filter);
    const books = await Book.find(filter).skip(skip).limit(safeLimit);
    return {
      books,
      total,
      page: safePage,
      totalPages: Math.ceil(total / safeLimit)
    };
  } catch (error) {
    throw new CustomError({statusCode: 500, message: error.message, code: 'INTERNAL_SERVER_ERROR'});
  }
}
// add pagination later

async function getById(id) {
  try {
    const book = await Book.findById(id);
    if (!book) throw new CustomError({statusCode: 404, message: 'Book not found', code: 'BOOK_NOT_FOUND'});
    return book;
  } catch (error) {
    if (error instanceof CustomError) throw error;
    throw new CustomError({statusCode: 500, message: error.message, code: 'INTERNAL_SERVER_ERROR'});
  }
}

async function add(req) {
  try {
    const bookData = req.body;
    const coverUrl = req.file?.path;
    if (!coverUrl) throw new CustomError({statusCode: 400, message: 'Add The Book', code: 'BOOKCOVER_NOT_FOUND'});
    return await Book.create({...bookData, coverUrl});
  } catch (error) {
    if (error instanceof CustomError) throw error;
    if (error.name === 'ValidationError') {
      throw new CustomError({statusCode: 422, message: error.message, code: 'BOOK_VALIDATION_FAILED'});
    }
    if (error.code === 11000)
      throw new CustomError({statusCode: 409, message: error.message, code: 'DUPLICATE_ENTRY'});
    throw new CustomError({statusCode: 500, message: error.message, code: 'INTERNAL_SERVER_ERROR'});
  }
}

async function update(id, req) {
  try {
    const updatedFields = req.body;
    const coverUrl = req.file?.path;
    if (Object.keys(updatedFields).length === 0 && !coverUrl)
      throw new CustomError({statusCode: 400, message: 'At least one field must be provided', code: 'NO_FIELDS_PROVIDED'});
    if (coverUrl) updatedFields.coverUrl = coverUrl;
    const updated = await Book.findByIdAndUpdate(id, {
      $set: updatedFields
    }, {
      returnDocument: 'after',
      runValidators: true
    });
    if (!updated) throw new CustomError({statusCode: 404, message: 'Book not found', code: 'BOOK_NOT_FOUND'});
    return updated;
  } catch (error) {
    if (error instanceof CustomError) throw error;
    if (error.name === 'ValidationError') {
      throw new CustomError({statusCode: 422, message: error.message, code: 'BOOK_VALIDATION_FAILED'});
    }
    if (error.code === 11000)
      throw new CustomError({statusCode: 409, message: error.message, code: 'DUPLICATE_ENTRY'});
    throw new CustomError({statusCode: 500, message: error.message, code: 'INTERNAL_SERVER_ERROR'});
  }
}

async function softDelete(id) {
  try {
    const deleted = await Book.findByIdAndUpdate(id, {
      $set: {isDeleted: true}
    }, {
      returnDocument: 'after'
    });
    if (!deleted) throw new CustomError({statusCode: 404, message: 'Book not found', code: 'BOOK_NOT_FOUND'});
    return {success: true};
  } catch (error) {
    if (error instanceof CustomError) throw error;
    throw new CustomError({statusCode: 500, message: error.message, code: 'INTERNAL_SERVER_ERROR'});
  }
}

async function getPopular() {
  try {
    const books = await Book.find().sort({averageRating: -1}).limit(10);
    if (!books.length) throw new CustomError({statusCode: 404, message: 'No popular books found', code: 'BOOK_NOT_FOUND'});
    return books;
  } catch (error) {
    if (error instanceof CustomError) throw error;
    throw new CustomError({statusCode: 500, message: error.message, code: 'INTERNAL_SERVER_ERROR'});
  }
}

// async function remove(id) {
//   return await Book.findByIdAndDelete(id);
// }
module.exports = {get, add, update, softDelete, getById, getPopular};
