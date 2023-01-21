const express = require('express');
const apiRouter = express.Router();
const cartsRouter = require('./cartsRouter');
const ordersRouter = require('./ordersRouter');
const productsRouter = require('./productsRouter');
const usersRouter = require('./usersRouter');
const authRouter = require('./authRouter');



apiRouter.use('/carts', cartsRouter);
apiRouter.use('/users', usersRouter);
apiRouter.use('/products', productsRouter);
apiRouter.use('/orders', ordersRouter);
apiRouter.use('/auth', authRouter);



module.exports = apiRouter;