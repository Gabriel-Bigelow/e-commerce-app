const express = require('express');
const { getCart, clearCartItems } = require('../db/cart');
const { getOrderById, getAllOrdersForUser, addOrder, addOrderProducts } = require('../db/orders');
const { addProductToCart, removeProductFromCart, addProduct, createProduct, deleteProduct } = require('../db/products');
const { getUsers, getUserById, createUser, deleteUser } = require('../db/users');
const bodyParser = require('body-parser').json();

const app = express();

//import data here



const PORT = process.env.PORT || 4000;


app.listen(PORT, () => {
    console.log(`Server is listening on ${PORT}`);
});


// app.get('/test', async (req, res, next) => {
//     try {
//         res.status(200).send('Hello again!');
//     } catch (err) {
//         next (err);
//     }
// })

// testing function to withdraw data objects from database

//No params/body
app.get('/getUsers', getUsers);
//req.body.userId
app.get('/getUserById', bodyParser, getUserById);


//req.body
app.get('/cart', bodyParser, getCart);

app.post('/users/createUser', bodyParser, createUser);
app.delete('/users/deleteUser', bodyParser, deleteUser);



app.get('/orders/:id', bodyParser, getOrderById);
app.get('/orders', bodyParser, getAllOrdersForUser);

app.post('/orders/addOrder', bodyParser, addOrder);
app.post('/orders/addOrder', bodyParser, addOrderProducts);
app.delete('/orders/addOrder', bodyParser, clearCartItems);


app.post('/products/addProduct', bodyParser, createProduct);
app.delete('/products/deleteProduct', bodyParser, deleteProduct);
app.post('/products/:productId/addToCart', bodyParser, addProductToCart);
app.delete('/cart/:productId/removeFromCart', bodyParser, removeProductFromCart);