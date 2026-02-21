
const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
  user: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
    index: true,
    required: true
  },
  items: [
    {
      book: {
        type: mongoose.Types.ObjectId,
        ref: 'books',
        required: true
      },
      quantity: {
        type: Number,
        min: 1,
        required: true
      },
      unit_price: {
        type: Number,
        required: true
      }
    }
  ],
  status: {
    type: String,
    enum: ['processing', 'out_for_delivery', 'delivered'],
    default: 'processing'
  },
  payment_status: {
    type: String,
    enum: ['pending', 'success'],
    default: 'pending'
  },
  payment_method: {
    type: String,
    enum: ['COD', 'online'],
    default: 'COD'
  },
  shipping_address: {
    street: {
      type: String,
      required: true
    },
    city: {
      type: String,
      required: true
    },
    state: {
      type: String,
      required: true
    },
    zip: {
      type: String,
      required: true
    },
    country: {
      type: String,
      required: true
    }
  },
  total_price: {
    type: Number,
    required: true
  }
}, { timestamps: true });

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;