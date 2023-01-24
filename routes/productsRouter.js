const express = require('express');
const productsRouter = express.Router();

const { addProductToCart, createProduct, deactivateProduct, activateProduct, updateProduct, getProducts, getProductById, checkSingleProductStock } = require('../db/products');



//none --- gets all products
productsRouter.get('/', getProducts);
//req.params - productId
productsRouter.get('/:productId', getProductById);
//req.body - name, price, stock
productsRouter.post('/createProduct', createProduct);
//req.body - productId (optional: name, price, stock) ---- POST request because it may end up making a new Products table entry. Put requests should always return the same value.
productsRouter.post('/updateProduct', updateProduct);
//req.body - productId
productsRouter.put('/activateProduct', activateProduct);
//req.body - productId
productsRouter.put('/deactivateProduct', deactivateProduct);
//req.body - userId | req.params - productId
productsRouter.post('/:productId/addToCart', checkSingleProductStock, addProductToCart);



module.exports = productsRouter;