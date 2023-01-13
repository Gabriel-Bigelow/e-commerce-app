const e = require('express');
const db = require('./index.js');

const getCart = (req, res, next) => {
    const { cartId } = req.body;

    if (!cartId) {
        throw new Error('Please specify a cart ID.');
    }

    const query = `SELECT name, COUNT (id), SUM (price) AS item_total
    FROM products
    JOIN cart_products
    ON products.id = cart_products.product_id
    WHERE cart_products.cart_id = ${cartId}
    GROUP BY (id);`;

    db.query(query, (error, results) => {
            if (error) {
                throw error;
            } else {
                res.status(200).send(results.rows);
            }
    })
};

const createCart = (req, res, next) => {
    const userId = res.locals.user.id;
    
    const query = `INSERT INTO carts (user_id)
    VALUES (${userId})
    RETURNING *`;

    db.query(query, (error, results) => {
        if (error) {
            throw error;
        } else {
            res.locals.cart = results.rows[0];
            res.status(200).send(res.locals);
        }
    }) 
}

const clearCartItems = (req, res, next) => {
    const { cartId } = req.body;
    console.log(cartId);

    const query = `DELETE FROM cart_products 
    WHERE cart_id = ${cartId}
    RETURNING *`;

    db.query(query, (error, results) => {
        if (error) {
            next(error);
        } else {
            res.status(200).send(results.rows);
        }
    })
};



module.exports = {
    getCart,
    createCart,
    clearCartItems,
};