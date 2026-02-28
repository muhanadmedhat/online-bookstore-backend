const CustomError = require('../helpers/CustomError.js');
const books = require('../models/book.js');
const carts = require('../models/cart.js');

async function getUserCart(userId) {
  const cartDetails = await carts.findOne({user: userId}).populate({path: 'items.book', populate: [{path: 'author'}, {path: 'categories'}]});
  if (!cartDetails) {
    throw new CustomError({statusCode: 404, code: 'NOT_FOUND', message: 'This user has no cart'});
  }
  return cartDetails;
}

async function addUserCart(userId, addedItems) {
  console.log(userId);
  console.log(addedItems);
  const addedBook = await books.findOne({_id: addedItems.book}).populate([{path: 'author'}, {path: 'categories'}]);
  // check if there is book with this ID
  if (!addedBook) {
    throw new CustomError({statusCode: 404, code: 'BOOK_NOT_FOUND', message: 'There is no book with this ID'});
  }
  // check book quantity
  if (addedItems.quantity > addedBook.stock) {
    throw new CustomError({statusCode: 400, code: 'INSUFFECIENT_STOCK', message: 'There is not enough stock for this book'});
  }
  const userCart = await carts.findOne({user: userId});
  // check if this is first cart for the user
  if (!userCart) {
    const addedCart = await carts.create({user: userId, items: [addedItems]});
    await addedCart.populate({path: 'items.book', populate: [{path: 'author'}, {path: 'categories'}]});
    return addedCart;
  }
  const itemInCart = userCart.items.find((item) => item.book.toString() === addedItems.book);
  // check if the item is already in cart
  if (itemInCart) {
    const totalQuantity = itemInCart.quantity + addedItems.quantity;
    if (totalQuantity > addedBook.stock) {
      throw new CustomError({statusCode: 400, code: 'INSUFFECIENT_STOCK', message: 'There is not enough stock for this book'});
    }
    itemInCart.quantity = totalQuantity;
    await userCart.save();
    await userCart.populate({path: 'items.book', populate: [{path: 'author'}, {path: 'categories'}]});
    return userCart;
  }
  userCart.items.push(addedItems);
  await userCart.save();
  await userCart.populate({path: 'items.book', populate: [{path: 'author'}, {path: 'categories'}]});
  return userCart;
}

async function updateBookQuantity(userId, bookId, newQuantity) {
  const userCart = await carts.findOne({user: userId});
  if (!userCart) {
    throw new CustomError({statusCode: 404, code: 'NOT_FOUND', message: 'This user has no cart'});
  }
  const updatedBook = await userCart.items.find((item) => item.book.toString() === bookId);
  if (!updatedBook) {
    throw new CustomError({statusCode: 404, code: 'NOT_FOUND', message: 'This user do not have this book in the cart'});
  }
  const editedBook = await books.findOne({_id: bookId});
  if (newQuantity > editedBook.stock) {
    throw new CustomError({statusCode: 400, code: 'INSUFFECIENT_STOCK', message: 'There is not enough stock for this book'});
  }
  if (newQuantity === 0) {
    userCart.items.pull({book: bookId});
    await userCart.save();
    return userCart;
  }
  updatedBook.quantity = newQuantity;
  await userCart.save();
  return updatedBook;
}

async function deleteUserBook(userId, bookId) {
  const userCart = await carts.findOne({user: userId});
  if (!userCart) {
    throw new CustomError({statusCode: 404, code: 'NOT_FOUND', message: 'This user has no cart'});
  }
  const deletedBook = await userCart.items.find((item) => item.book.toString() === bookId);
  if (!deletedBook) {
    throw new CustomError({statusCode: 404, code: 'NOT_FOUND', message: 'This user do not have this book in the cart'});
  }
  userCart.items.pull({book: bookId});
  await userCart.save();
  return deletedBook;
}

async function deleteUserCart(userId) {
  const userCart = await carts.findOne({user: userId});
  if (!userCart) {
    throw new CustomError({statusCode: 404, code: 'NOT_FOUND', message: 'This user has no cart'});
  }
  const deletedCart = userCart.items;
  userCart.items = [];
  await userCart.save();
  return deletedCart;
}

module.exports = {
  getUserCart,
  addUserCart,
  updateBookQuantity,
  deleteUserBook,
  deleteUserCart
};
