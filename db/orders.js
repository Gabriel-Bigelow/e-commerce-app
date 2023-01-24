const db = require('./index.js');

// Returns all orders
const getOrders = (req, res, next) => {
    const query = `SELECT orders.id AS order_id, email, SUM(quantity) AS items FROM orders
    JOIN users
    ON orders.user_id = users.id
    JOIN order_products
    ON order_products.order_id = orders.id
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

    const query = `SELECT orders.id, product_id, name, COUNT (product_id) AS quantity, SUM (price) AS items_total
    FROM orders
    JOIN order_products
    ON order_products.order_Id = orders.id
    JOIN products
    ON products.id = order_products.product_id
    WHERE user_id = ${userId}
    GROUP BY (orders.id, order_products.product_id, name)
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
const getOrderById = (req, res, next) => {
    const { orderId } = req.params;

    const query = `SELECT name, COUNT (id), SUM (price) AS item_total
    FROM products
    JOIN order_products
    ON products.id = order_products.product_id
    WHERE order_products.order_id = ${orderId}
    GROUP BY (id);`;

    db.query(query, (error, results) => {
            if (error) {
                throw error;
            } else {
                res.send(results.rows[0]);
            }
    })
};

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


// Deprecated (kind of) --- This is now handled by deleteUser
// const deleteAllOrdersByUserId = (req, res, next) => {
//     const { userId } = req.body;

//     const query = `WITH orderProductsToDelete AS (
//         SELECT orders.id AS order_id, product_id
//         FROM orders
//         JOIN order_products
//         ON orders.id = order_products.order_id
//         WHERE user_id = ${userId}
//       ),
//       productsDeleted AS (
//         DELETE FROM order_products
//         WHERE order_id IN (SELECT order_id FROM orderProductsToDelete)
//       )
//       DELETE FROM orders
//       WHERE user_id = ${userId};`;

//     db.query(query, (error, results) => {
//         if (error) {
//             throw error;
//         } else {
//             next();
//         }
//     });
// }

module.exports = {
    getOrders,
    getAllOrdersForUser,
    getOrderById,
    deleteOrderById
    // deleteAllOrdersByUserId
}