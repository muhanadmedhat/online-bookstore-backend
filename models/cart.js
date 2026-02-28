const mongoose = require('mongoose');

const cartSchema = mongoose.Schema({
  user: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
    unique: true,
    required: true
  },
  items: [
    {
      book: {
        type: mongoose.Types.ObjectId,
        ref: 'Book',
        required: true
      },
      quantity: {
        type: Number,
        min: 1,
        required: true
      }
    }
  ]
}, {timestamps: true});

const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;
