const express = require('express');
const productsRouter = express.Router();
const bodyParser = require('body-parser').json();

const { addProductToCart, createProduct, deactivateProduct, activateProduct, updateProduct, getProducts, getProductById, checkSingleProductStock } = require('../db/products');



//none
productsRouter.get('/', getProducts);
//req.params - productId
productsRouter.get('/:productId', bodyParser, getProductById);
//req.body - name, price, stock
productsRouter.post('/createProduct', bodyParser, createProduct);
//req.body - productId (optional: name, price, stock) ---- POST request because it may end up making a new Products table entry. Put requests should always return the same value.
productsRouter.post('/updateProduct', bodyParser, updateProduct);
//req.body - productId
productsRouter.put('/activateProduct', bodyParser, activateProduct);
//req.body - productId
productsRouter.put('/deactivateProduct', bodyParser, deactivateProduct);
//req.body - userId | req.params - productId
productsRouter.post('/:productId/addToCart', bodyParser, checkSingleProductStock, addProductToCart);



module.exports = productsRouter;