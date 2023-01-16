const express = require('express');
const { checkoutCart, getCartProducts, getCartTotal } = require('../db/cart');
const { getOrderById, getAllOrdersForUser, deleteOrderById } = require('../db/orders');
const { addProductToCart, removeProductFromCart, createProduct, deactivateProduct, activateProduct, updateProduct, getProducts, getProductById } = require('../db/products');
const { getUsers, getUserById, createUser, deleteUser } = require('../db/users');
const bodyParser = require('body-parser').json();

const app = express();

//import data here



const PORT = process.env.PORT || 4000;


app.listen(PORT, () => {
    console.log(`Server is listening on ${PORT}`);
});


//req.body - username, firstName, lastName, address, city, state (2), country (3)
app.post('/users/createUser', bodyParser, createUser);
//req.body - userId
// delete orders_products, then orders, then cart_products, then carts, then user
app.delete('/users/deleteUser', bodyParser, deleteUser);//deleteAllOrdersByUserId, deleteCart, deleteUser);
//None
app.get('/getUsers', getUsers);
//req.body - userId
app.get('/getUserById', bodyParser, getUserById);


//req.body - userId
app.get('/cart', bodyParser, getCartProducts, getCartTotal);

//req.body - userId
app.post('/cart/checkout', bodyParser, checkoutCart);



//req.params - orderId
app.get('/orders/:orderId', bodyParser, getOrderById);
//req.body - userId
app.get('/orders', bodyParser, getAllOrdersForUser);
//req.body - orderId
app.delete('orders/deleteOrder', bodyParser, deleteOrderById);



//none
app.get('/products', getProducts);
//req.params - productId
app.get('/products/:productId', bodyParser, getProductById);
//req.body - name, price, stock
app.post('/products/createProduct', bodyParser, createProduct);
//req.body - productId (optional: name, price, stock)
app.post('/products/updateProduct', bodyParser, updateProduct);
//req.body - productId
app.put('/products/activateProduct', bodyParser, activateProduct);
//req.body - productId
app.put('/products/deactivateProduct', bodyParser, deactivateProduct);
// THIS SHOULD MAYBE CHANGED TO userId
//req.body - cartId, productId
app.post('/products/:productId/addToCart', bodyParser, addProductToCart);
// THIS SHOULD MAYBE CHANGED TO userId
//req.body - cartId, productId
app.delete('/cart/:productId/removeFromCart', bodyParser, removeProductFromCart);