const mongoose = require('mongoose');
const CustomError = require('../helpers/CustomError');
const books = require('../models/book.js');
const carts = require('../models/cart.js');
const orders = require('../models/order');

async function createOrder(userId, shippingAddress, payementMethod) {
  const userCart = await carts.findOne({user: userId}).populate({path: 'items.book', populate: [{path: 'author'}, {path: 'categories'}]});
  if (!userCart) {
    throw new CustomError({statusCode: 404, code: 'NO_CART', message: 'This user has no cart'});
  }
  const session = await mongoose.startSession();
  await session.startTransaction();
  const orderItems = [];
  try {
    for (const item of userCart.items) {
      const wantedBook = await books.findOne({_id: item.book}).session(session);
      if (!wantedBook) {
        throw new CustomError({statusCode: 404, code: 'DELETED_ITEM', message: 'This book is not avalaible at the moment'});
      }
      if (item.quantity > wantedBook.stock) {
        throw new CustomError({statusCode: 400, code: 'INSUFFECIENT_STOCK', message: 'There is not enough stock for this book'});
      }
      orderItems.push({
        book: item.book,
        quantity: item.quantity,
        unit_price: wantedBook.price
      });
      wantedBook.stock -= item.quantity;
      await wantedBook.save({session});
    }
    const totalPrice = orderItems.reduce((sum, item) => {
      return sum + (item.unit_price * item.quantity);
    }, 0);
    const newOrder = await orders.create([{
      user: userId,
      items: orderItems,
      shipping_address: shippingAddress,
      payment_method: payementMethod,
      total_price: totalPrice
    }], {session});
    userCart.items = [];
    await userCart.save({session});
    await session.commitTransaction();
    return newOrder;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
}

async function getUserOrders(userId, pageNumber) {
  const totalDocuments = await orders.countDocuments({user: userId});
  if (totalDocuments === 0) {
    throw new CustomError({statusCode: 404, code: 'NO_ORDERS', message: 'This user has no order'});
  }
  const page = Math.min(Number(pageNumber) || 1, 50);
  const limit = 10;
  const skip = (page - 1) * limit;
  const userOrders = await orders.find({user: userId}).populate('items.book').skip(skip).limit(limit).sort({createdAt: -1});
  return {
    total: totalDocuments,
    pages: Math.ceil(totalDocuments / limit),
    userOrdersPaginated: userOrders
  };
}

async function getAllOrders(pageNumber, status, user) {
  const page = Math.min(Number(pageNumber) || 1, 50);
  const limit = 10;
  const skip = (page - 1) * limit;
  const filter = {};
  if (status) {
    filter.status = status;
  }
  if (user) {
    filter.user = user;
  }
  const orderPaginated = await orders.find(filter)
    .populate({
      path: 'items.book',
      populate: [{path: 'author'}, {path: 'categories'}]
    })
    .skip(skip)
    .limit(limit)
    .sort({createdAt: -1});
  const totalOrders = await orders.countDocuments(filter);
  return {
    total: totalOrders,
    pages: Math.ceil(totalOrders / limit),
    orderSent: orderPaginated
  };
}

async function getSpecificOrder(user, orderId) {
  const order = await orders.findById(orderId).populate('items.book');
  if (!order) {
    throw new CustomError({statusCode: 404, code: 'NOT_FOUND', message: 'There is nor order with this ID'});
  }
  if (order.user.toString() !== user.id && user.role !== 'admin') {
    throw new CustomError({statusCode: 403, code: 'AUTH_ERROR', message: 'The order you are trying to get does not belong to this user'});
  }
  return order;
}

async function updateOrderStatus(orderId, status) {
  const orderStatus = ['processing', 'out_for_delivery', 'delivered'];
  const order = await orders.findById(orderId);
  if (!order) {
    throw new CustomError({statusCode: 404, code: 'NOT_FOUND', message: 'There is nor order with this ID'});
  }
  const currentIndex = orderStatus.indexOf(order.status);
  const newIndex = orderStatus.indexOf(status);
  if (newIndex === currentIndex + 1) {
    order.status = status;
  } else {
    throw new CustomError({statusCode: 400, code: 'INV_TRANSITION', message: 'This transition is not valid'});
  }
  await order.save();
  return order;
}

async function updateOrderPayment(orderId, payment) {
  const paymentStatus = ['pending', 'success'];
  const order = await orders.findById(orderId);
  if (!order) {
    throw new CustomError({statusCode: 404, code: 'NOT_FOUND', message: 'There is nor order with this ID'});
  }
  const currentIndex = paymentStatus.indexOf(order.payment_status);
  const newIndex = paymentStatus.indexOf(payment);
  if (newIndex === currentIndex + 1) {
    order.payment_status = payment;
  } else {
    throw new CustomError({statusCode: 400, code: 'INV_TRANSITION', message: 'This transition is not valid'});
  }
  await order.save();
  return order;
}
module.exports = {
  createOrder,
  getUserOrders,
  getAllOrders,
  getSpecificOrder,
  updateOrderStatus,
  updateOrderPayment
};
