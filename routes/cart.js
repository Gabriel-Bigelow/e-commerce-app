const express = require('express');
const router = express.Router();


//cart {} object
//cart object has following properties: 
//  userId var
//  cartId var
//  items [] array
//      items is populated with item {} objects

//item {} (object) has the following properties
//  id integer
//  quantity integer
//  price float
//  


module.exports = (app) => {
    app.use('/cart', router);

    router.get('/', async (req, res, next) => {
        try {
            // assign the current user's account ID to a variable (from req)

            // assign the response to a result of asynchronously pulling the cart data at the specified account ID.

            //res.status(200).send(response);
        } catch (err) {
            next(err);
        }
    });


    router.put('/', async (req, res, next) => {
        try {
            // unsure || maybe clear cart and start fresh?
        } catch (err) {
            next(err);
        }
    });

    router.post('/items', async (req, res, next) => {
        try {
            // unsure || add item to cart?
        } catch (err) {
            next(err);
        }
    });

    router.put('/items/:itemId', async (req, res, next) => {
        try {
            // assign the current itemId from req.params to a variable (from req)

            // assign the response to a result of asynchronously updating the specified item in the current user's cart.
            
            //res.status(200).send(response);
        } catch (err) {
            next(err);
        }
    });
    
    router.delete('items/:itemId', async (req, res, next) => {
        try {
            //assign the current itemId from req.params to a variable (from req)

            //assign the response to a result of asynchronously deleting the specified item from the current user's cart.

            //res.status(200).send(response)
        } catch (err) {
            next(err);
        }
    });

    router.post('/checkout', async (req, res, next) => {
        // assign the current user's account ID to a variable (from req)
        // assign the current cart's id to a variable (from req)
        // assign the payment info to a variable (from req)

        //assign the response to a result of asynchronously calling a checkout function, with the userId, cartId, and payment info as arguments.
    })
}