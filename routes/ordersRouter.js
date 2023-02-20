const express = require('express');
const ordersRouter = express.Router();

const { getOrderProductsById, getAllOrdersForUser, deleteOrderById, getOrders, getOrderTotalById, getAllOrdersProducts } = require('../db/orders');

// NONE
ordersRouter.get('/allUsersOrders', getOrders);

// all orders for the Passport user that is currently logged in are grabbed.
ordersRouter.get('/', getAllOrdersForUser, getAllOrdersProducts);

// ordersRouter.get('/detailed', getAllOrdersProducts);

// req.params - ordedId
ordersRouter.get('/:orderId', getOrderProductsById, getOrderTotalById);







// ORDERS SHOULD NOT NORMALY BE DELETED --- MAY RESULT IN LOSS OF DATABASE INTEGRITY
// req.body - orderId
ordersRouter.delete('/deleteOrder', deleteOrderById);



module.exports = ordersRouter;