const express = require('express');
const { getCart } = require('../db/cart');
const { getOrderById, getAllOrdersForUser, addOrder, addOrderProducts } = require('../db/orders');
const { getUsers, getUsersById } = require('../db/users');
const bodyParser = require('body-parser').json();

const app = express();

//import data here



const PORT = process.env.PORT || 4000;


app.listen(PORT, () => {
    console.log(`Server is listening on ${PORT}`);
});


app.get('/', async (req, res, next) => {
    try {       
        res.status(200).send('This is a test of the homepage get request');
    } catch (err) {
        next (err);
    }
})


app.get('/test', async (req, res, next) => {
    try {
        res.status(200).send('Hello again!');
    } catch (err) {
        next (err);
    }
})

// testing function to withdraw data objects from database
app.get('/testFunction', getUsers);
app.get('/testFunction2', bodyParser, getUsersById);


app.get('/testGetCart', bodyParser, getCart);

app.get('/testGetOrderById', bodyParser, getOrderById);
app.get('/testGetAllOrders', bodyParser, getAllOrdersForUser);
app.post('/testAddOrder', bodyParser, addOrder);
app.post('/testAddOrder', bodyParser, addOrderProducts);