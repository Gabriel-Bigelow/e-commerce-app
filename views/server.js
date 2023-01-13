const express = require('express');
const { getCart, clearCartItems, createCart } = require('../db/cart');
const { getOrderById, getAllOrdersForUser, addOrder, addOrderProducts, getProductsFromCart, getOrdersProductsForDelete } = require('../db/orders');
const { addProductToCart, removeProductFromCart, addProduct, createProduct, deleteProduct } = require('../db/products');
const { getUsers, getUserById, createUser, deleteUser } = require('../db/users');
const bodyParser = require('body-parser').json();

const app = express();

//import data here



const PORT = process.env.PORT || 4000;


app.listen(PORT, () => {
    console.log(`Server is listening on ${PORT}`);
});


//req.body - username, firstName, lastName, address, city, state (2), country (3)
app.post('/users/createUser', bodyParser, createUser, createCart);
//req.body - userId
// delete orders_products, then orders, then cart_products, then carts, then user
app.delete('/users/deleteUser', bodyParser, /*getOrdersProductsForDelete,*/ clearCartItems, deleteUser);
//None
app.get('/getUsers', getUsers);
//req.body - userId
app.get('/getUserById', bodyParser, getUserById);


//req.body - cartId
app.get('/cart', bodyParser, getCart);




//req.params - orderId
app.get('/orders/:orderId', bodyParser, getOrderById);
//none
app.get('/orders', bodyParser, getAllOrdersForUser);

//req.body - cartId, userId, products
app.post('/orders/createOrder', bodyParser, addOrder, getProductsFromCart, addOrderProducts, clearCartItems);

//req.body - name, price, stock
app.post('/products/addProduct', bodyParser, createProduct);
//req.body - productId
app.delete('/products/deleteProduct', bodyParser, deleteProduct);
//req.body - cartId, productId
app.post('/products/:productId/addToCart', bodyParser, addProductToCart);
//req.body - cartId, productId
app.delete('/cart/:productId/removeFromCart', bodyParser, removeProductFromCart);