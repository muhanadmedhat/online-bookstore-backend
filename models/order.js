const { string } = require('joi');
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
        type: number,
        min: 1,
        required: true
      },
      unit_price: {
        type: number
      }
    }
  ],
  status: {
    type: string,
    enum: ['processing', 'out_for_delivery', 'delivered'],
    default: 'processing'
  },
  payment_status: {
    type: string,
    enum: ['pending', 'success'],
    default: 'pending'
  },
  payment_method: {
    type: string,
    enum: ['COD', 'online'],
    default: 'COD'
  },
  shipping_address: {
    street: {
      type: string
    },
    city: {
      type: string
    },
    state: {
      type: string
    },
    zip: {
      type: string
    },
    country: {
      type: string
    }
  },
  total_price: {
    type: Number
  }
}, { timestamps: true });

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;