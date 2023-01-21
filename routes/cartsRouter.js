const express = require('express');
const cartsRouter = express.Router();

const { checkoutCart, getCartProducts, getCartTotal, removeProductFromCart, updateStock, checkCartProductsStock } = require('../db/cart');



//req.body - userId
cartsRouter.get('/', getCartProducts, getCartTotal);
//req.body - userId
cartsRouter.post('/checkout', checkCartProductsStock, checkoutCart, updateStock);
//req.body - userId, productId
cartsRouter.delete('/removeProductFromCart', removeProductFromCart);



module.exports = cartsRouter;