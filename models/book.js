const mongoose = require("mongoose");

const bookSchema = mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    maxLength: 30,
    required: true
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Author',
    required: true
  },
  categories: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Category',
    required: true
  },
  coverUrl: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  stock: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  description: {
    type: String,
    minLength: 30,
    maxLength: 500,
    required: true
  },
  averageRating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  }
}, { timestamps: true });

const Book = mongoose.model('books', bookSchema);

module.exports = Book;