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
    const { orderId } = req.params;

    const query = `SELECT name, COUNT (id), SUM (price) AS item_total
    FROM products
    JOIN order_products
    ON products.id = order_products.product_id
    WHERE order_products.order_id = ${orderId}
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

    const query = `INSERT INTO orders (user_id) 
    VALUES (${userId}) 
    RETURNING *`

    db.query(query, (error, results) => {
        if (error) {
            next (error);
        } else {
            res.locals.orderId = results.rows[0].id;
            next();
        }
    });
};

const getProductsFromCart = (req, res, next) => {
    const { cartId } = req.body;
    
    const query = `SELECT product_id 
    FROM cart_products 
    WHERE cart_id = ${cartId}`;

    db.query(query, (error, results) => { 
        if (error) {
            throw error;
        } else {
            res.locals.products = results.rows;
            next()
        }
    })
}

//potential changes?
//pass cart_products rows in | delete custom request
//pass response to next middleware function 
const addOrderProducts = (req, res, next) => {
    const { products, orderId } = res.locals;

    let query = `INSERT INTO order_products (order_id, product_id) VALUES `;
    products.forEach(product => query = query.concat(`(${orderId}, ${product["product_id"]}),`));
    query = query.slice(0, query.length-1);

    db.query(query, (error, results) => {
        if (error) {
            next (error);
        } else {
            next();
        }
    })
};




const deleteAllOrdersByUserId = (req, res, next) => {
    const { userId } = req.body;

    const query = `WITH orderProductsToDelete AS (
        SELECT orders.id AS order_id, product_id
        FROM orders
        JOIN order_products
        ON orders.id = order_products.order_id
        WHERE user_id = ${userId}
      ),
      productsDeleted AS (
        DELETE FROM order_products
        WHERE order_id IN (SELECT order_id FROM orderProductsToDelete)
      )
      DELETE FROM orders
      WHERE user_id = ${userId};`;

    db.query(query, (error, results) => {
        if (error) {
            throw error;
        } else {
            next();
        }
    });
}

module.exports = {
    getAllOrdersForUser,
    getOrderById,
    addOrder,
    getProductsFromCart,
    addOrderProducts,

    deleteAllOrdersByUserId
}