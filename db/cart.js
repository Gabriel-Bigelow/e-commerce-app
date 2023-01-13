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
                res.send(error);
            } else {
                res.status(200).send(results.rows);
            }
    })
}

const clearCartItems = (req, res, next) => {
    const { cartId } = req.body;

    const query = `DELETE FROM cart_products 
    WHERE cart_id = ${cartId}`;

    db.query(query, (error, results) => {
        if (error) {
            next(error);
        } else {
            next();
        }
    })
};



module.exports = {
    getCart,
    clearCartItems
}