const mongoose = require('mongoose');
const Book = require('../models/book');

const Review = require('../models/review');

async function syncAverageRating(bookId) {
  const objectId = new mongoose.Types.ObjectId(bookId);
  const result = await Review.aggregate([
    {$match: {book: objectId}},
    {$group: {_id: null, avg: {$avg: '$rating'}}}
  ]);
  const avg = result.length ? Number.parseFloat(result[0].avg.toFixed(2)) : 0;
  await Book.findByIdAndUpdate(bookId, {averageRating: avg});
}

module.exports = syncAverageRating;
