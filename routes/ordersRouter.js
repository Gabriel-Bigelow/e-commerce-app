const express = require('express');
const ordersRouter = express.Router();
const bodyParser = require('body-parser').json();

const { getOrderById, getAllOrdersForUser, deleteOrderById, getOrders } = require('../db/orders');



// NONE
ordersRouter.get('/orders', getOrders);
//req.params - orderId
ordersRouter.get('/orders/:orderId', bodyParser, getOrderById);
//req.body - userId
ordersRouter.get('/user/orders', bodyParser, getAllOrdersForUser);
//req.body - orderId
ordersRouter.delete('/orders/deleteOrder', bodyParser, deleteOrderById);



module.exports = ordersRouter;