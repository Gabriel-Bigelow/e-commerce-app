const express = require('express');
const cartsRouter = express.Router();
const bodyParser = require('body-parser').json();

const { checkoutCart, getCartProducts, getCartTotal, removeProductFromCart, updateStock, checkCartProductsStock } = require('../db/cart');



//req.body - userId
cartsRouter.get('/', bodyParser, getCartProducts, getCartTotal);
//req.body - userId
cartsRouter.post('/checkout', bodyParser, checkCartProductsStock, checkoutCart, updateStock);
//req.body - userId, productId
cartsRouter.delete('/removeProductFromCart', bodyParser, removeProductFromCart);



module.exports = cartsRouter;