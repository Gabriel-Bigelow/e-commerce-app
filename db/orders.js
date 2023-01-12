const db = require('./index.js');

const getAllOrdersForUser = (req, res, next) => {
    const { userId } = req.body

    const query = `SELECT orders.id, product_id, name, COUNT (product_id) AS quantity, SUM (price) AS items_total
    FROM orders
    JOIN order_products
    ON order_products.order_Id = orders.id
    JOIN products
    ON products.id = order_products.product_id
    WHERE user_id = ${userId}
    GROUP BY (orders.id, order_products.product_id, name);`;

    db.query(query, (error, results) => {
            if (error) {
                next(error);
            } else {
                res.send(results.rows);
            }
        })
};

const getOrderById = (req, res, next) => {
    const { id } = req.body;

    const query = `SELECT name, COUNT (id), SUM (price) AS item_total
    FROM products
    JOIN order_products
    ON products.id = order_products.product_id
    WHERE order_products.order_id = ${id}
    GROUP BY (id);`;

    db.query(query, (error, results) => {
            if (error) {
                next(error)
            } else {
                res.send(results.rows);
            }
    })
};

const addOrder = (req, res, next) => {
    const { userId } = req.body

    const query = `INSERT INTO orders (user_id) VALUES (${userId})`

    db.query(query, (error, results) => {
        if (error) {
            next (error);
        } else {
            next()
        }
    })
}

const addOrderProducts = (req, res, next) => {
    const { products } = req.body;

    let query = `INSERT INTO order_products (order_id, product_id) VALUES `;
    products.forEach(product => query = query.concat(`(18, ${product.productId}),`));
    query = query.slice(0, query.length-1);

    db.query(query, (error, results) => {
        if (error) {
            next (error);
        } else {
            res.status(200).send('Order added');
        }
    })
}

module.exports = {
    getAllOrdersForUser,
    getOrderById,
    addOrder,
    addOrderProducts
}