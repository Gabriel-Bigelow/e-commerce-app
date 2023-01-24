const express = require('express');
const cartsRouter = express.Router();

const { checkoutCart, getCartProducts, getCartTotal, removeProductFromCart, updateStock, checkCartProductsStock } = require('../db/cart');


// gets all items in the current user's cart, quantities, prices, and the total cart items and total price
cartsRouter.get('/', getCartProducts, getCartTotal);

// creates an order and moves current user's cart items to order_products.
cartsRouter.post('/checkout', checkCartProductsStock, checkoutCart, updateStock);

//req.body - productId
cartsRouter.delete('/removeProductFromCart', removeProductFromCart);



module.exports = cartsRouter;