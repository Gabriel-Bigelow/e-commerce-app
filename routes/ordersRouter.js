const express = require('express');
const ordersRouter = express.Router();

const { getOrderById, getAllOrdersForUser, deleteOrderById, getOrders } = require('../db/orders');

// NONE
ordersRouter.get('/allUsersOrders', getOrders);

// all orders for the Passport user that is currently logged in are grabbed.
ordersRouter.get('/', getAllOrdersForUser);

// req.params - ordedId
ordersRouter.get('/:orderId', getOrderById);







// ORDERS SHOULD NOT NORMALY BE DELETED --- MAY RESULT IN LOSS OF DATABASE INTEGRITY
//req.body - orderId
ordersRouter.delete('/deleteOrder', deleteOrderById);



module.exports = ordersRouter;