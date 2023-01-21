const express = require('express');
const ordersRouter = express.Router();

const { getOrderById, getAllOrdersForUser, deleteOrderById, getOrders } = require('../db/orders');



// NONE
ordersRouter.get('/all', getOrders);
//req.params - orderId
ordersRouter.get('/:orderId', getOrderById);
//req.body - userId
ordersRouter.get('/user/orders', getAllOrdersForUser);
//req.body - orderId
ordersRouter.delete('/orders/deleteOrder', deleteOrderById);



module.exports = ordersRouter;