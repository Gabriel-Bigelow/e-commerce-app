const e = require('express');
const db = require('./index.js');

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

const clearCartItems = (req, res, next) => {
    const { cartId } = req.body;
    console.log(cartId);

    const query = `DELETE FROM cart_products 
    WHERE cart_id = ${cartId}
    RETURNING *`;

    db.query(query, (error, results) => {
        if (error) {
            throw error;
        } else {
            res.status(200).send(results.rows);
        }
    })
};


const checkoutCart = (req, res, next) => {
    const { userId } = req.body;

    const query = `WITH current_user_cart_products AS (
        DELETE FROM cart_products
            USING carts
        WHERE carts.id = cart_products.cart_id AND user_id = ${userId}
        RETURNING product_id
      ),
      current_order AS (
        INSERT INTO orders (user_id)
        VALUES (${userId})
        RETURNING id AS order_id
      ),
      current_order_products AS (
        SELECT * FROM current_order
        CROSS JOIN current_user_cart_products
      )
      INSERT INTO order_products (order_id, product_id) SELECT order_id, product_id FROM current_order_products
      RETURNING *`;

      db.query(query, (error, results) => {
        if (error) {
            throw error;
        } else {
            res.status(201).send(results.rows);
        }
      });
}

const deleteCart = (req, res, next) => {
    const { userId } = req.body;

    const query = `WITH cartToDelete AS (
        SELECT cart_id
        FROM cart_products
        JOIN carts
        ON cart_id = carts.id
        WHERE user_id = ${userId}
      ),
      productsDeleted AS (
        DELETE FROM cart_products
        WHERE cart_id IN (SELECT cart_id FROM cartToDelete)
      )
      DELETE FROM carts
      WHERE user_id = ${userId};`;

    db.query(query, (error, results) => {
        if (error) {
            throw error;
        } else {
            next();
        }
    })
}


module.exports = {
    createCart,
    getCart,
    clearCartItems,

    checkoutCart,
    deleteCart
};