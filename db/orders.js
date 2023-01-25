const db = require('./index.js');

// Returns all orders
const getOrders = (req, res, next) => {
    const query = `SELECT orders.id AS order_id, email, count(product_id) as unique_products, SUM(price) AS total_price, SUM(quantity) AS total_items FROM orders
    JOIN users
    ON orders.user_id = users.id
    JOIN order_products
    ON order_products.order_id = orders.id
    JOIN products
    ON order_products.product_id = products.id
    GROUP BY (orders.id, email)
    ORDER BY orders.id`;

    db.query(query, (error, results) => {
        if (error) {
            throw error;
        } else {
            res.status(200).send(results.rows);
        }
    })
}

// Returns all orders by the user, and the products associated with those orders.
const getAllOrdersForUser = (req, res, next) => {
    if (!req.user) return res.status(401).send('User not logged in.');

    const userId = req.user.id;

    const query = `SELECT orders.id AS order_id, COUNT(product_id) AS unique_products, SUM(quantity) AS total_items, SUM (price) AS total_price
    FROM orders
    JOIN order_products
    ON order_products.order_Id = orders.id
    JOIN products
    ON products.id = order_products.product_id
    WHERE user_id = ${userId}
    GROUP BY (orders.id)
    ORDER BY (orders.id) ASC;`;

    db.query(query, (error, results) => {
            if (error) {
                throw error;
            } else {
                res.send(results.rows);
            }
        })
};

// Returns an order specified by orderId, and the products associated with that order.
const getOrderProductsById = (req, res, next) => {
    const { orderId } = req.params;

    const query = `SELECT product_id, name, price, quantity, SUM (price * quantity) AS product_total
    FROM products
    JOIN order_products
    ON products.id = order_products.product_id
    WHERE order_products.order_id = ${orderId}
    GROUP BY (product_id, id, quantity);`;

    db.query(query, (error, results) => {
            if (error) {
                throw error;
            } else {
                res.locals.orderProducts = results.rows;
                next();
            }
    })
};

const getOrderTotalById = (req, res, next) => {
    const { orderId } = req.params;

    const query = `SELECT COUNT (product_id) AS product_types, SUM (quantity) AS total_items, SUM(price * quantity) AS total FROM order_products
    JOIN orders
    ON orders.id = order_products.order_id
    JOIN products
    ON products.id = order_products.product_id
    WHERE user_id = ${orderId};`;

    db.query(query, (error, results) => {
        if (error) {
            throw error;
        } else {
            res.locals.orderTotal = results.rows[0];
            res.status(200).send(res.locals);
        }
    })
}

// May be useful for canceling an order, but this should probably end up being deleted.
const deleteOrderById = (req, res, next) => {
    const { orderId } = req.body;

    const query = `WITH deleted_order_products AS (
        DELETE FROM order_products
        USING orders
        WHERE orders.id = order_products.order_id AND orders.id = ${orderId}
      ),
      DELETE FROM orders
      WHERE order_id = ${orderId}`
}

module.exports = {
    getOrders,
    getAllOrdersForUser,
    getOrderProductsById,
    getOrderTotalById,
    deleteOrderById
    // deleteAllOrdersByUserId
}