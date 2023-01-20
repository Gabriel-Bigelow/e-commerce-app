const db = require('./index.js');

//gets the total of each set of items and returns the total price of each set of items
const getCartProducts = (req, res, next) => {
    const { userId } = req.body;

    const query = `SELECT product_id, quantity, name, SUM(price) AS total FROM cart_products
    JOIN carts
    ON carts.id = cart_products.cart_id
    JOIN products
    ON products.id = cart_products.product_id
    WHERE user_id = ${userId}
    GROUP BY (product_id, name, quantity)`;

    db.query(query, (error, results) => {
            if (error) {
                throw error;
            } else {
                res.locals.cartProducts = results.rows;
                next();
            }
    })
};

//gets the total number of items in the cart and the total price of the cart
const getCartTotal = (req, res, next) => {
    const { userId } = req.body;

    const query = `SELECT COUNT (product_id) AS product_types, SUM (product_id) AS total_items, SUM(price) AS total FROM cart_products
    JOIN carts
    ON carts.id = cart_products.cart_id
    JOIN products
    ON products.id = cart_products.product_id
    WHERE user_id = ${userId};`

    db.query(query, (error, results) => {
        if (error) {
            throw error;
        } else {
            res.locals.cartTotal = results.rows[0];
            res.status(200).send(res.locals);
        }
    })
};

//removes a product from the cart
const removeProductFromCart = (req, res, next) => {
    const { userId, productId } = req.body;

    const query = `DELETE FROM cart_products
    USING carts, products
    WHERE cart_id = carts.id 
    AND carts.user_id = ${userId} 
    AND products.id = cart_products.product_id 
    AND product_id = ${productId}
    RETURNING product_id, name, price AS price_per_item, quantity`;

    db.query(query, (error, results) => {
        if (error) {
            throw error;
        } else {
            res.status(200).send(results.rows[0]);
        }
    });
}



// clears all items from the current user's cart
const clearCartItems = (req, res, next) => {
    const { userId } = req.body;

    const query = `DELETE FROM cart_products 
    USING carts
    WHERE carts.id = cart_id AND carts.user_id = ${userId}
    RETURNING *`;

    db.query(query, (error, results) => {
        if (error) {
            throw error;
        } else {
            res.status(200).send(results.rows);
        }
    })
};

// Checks to make sure all products in the cart are in sufficient stock to create an order.
const checkCartProductsStock = (req, res, next) => {
    const { userId } = req.body;

    const query = `SELECT product_id, quantity, stock
        FROM cart_products
        JOIN carts
        ON cart_products.cart_id = carts.id
        JOIN products
        ON cart_products.product_id = products.id
        WHERE carts.user_id = ${userId}`

    db.query(query, (error, results) => {
        if (error) {
            throw error;
        } else if (results.rows.every(product => product.quantity <= product.stock)) {
            next();            
        } else {
            res.status(403).send("More items in cart than are in stock.");
        }
    });
}

// Creates an order entry attached to the current user and transfers the items from the associated entries on the cart_products table to the associated order on the order_products table
const checkoutCart = (req, res, next) => {
    const { userId } = req.body;


    const query = `WITH current_user_cart_products AS (
        DELETE FROM cart_products
            USING carts
        WHERE carts.id = cart_products.cart_id AND user_id = ${userId}
        RETURNING product_id, quantity
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
      INSERT INTO order_products (order_id, product_id, quantity) SELECT order_id, product_id, quantity FROM current_order_products
      RETURNING *`;

      db.query(query, (error, results) => {
        if (error) {
            throw error;
        } else {
            res.locals.newOrder = results.rows;
            next()
        }
      });
};

//updates the stock of each product in the products table after successful checkout
const updateStock = (req, res, next) => {
    const { newOrder } = res.locals;

    newOrder.forEach(product => {
        const query = `WITH old_product_stock AS (
            SELECT stock FROM products
            WHERE id = ${product.product_id}
        )
        UPDATE products
        SET stock = (SELECT stock from old_product_stock) - ${product.quantity}
        WHERE id = ${product.product_id}
        RETURNING *`;

        db.query(query, (error, results) => {
            if (error) {
                throw error;
            }
        })
    })

    res.status(201).send(newOrder);

};


module.exports = {
    getCartProducts,
    getCartTotal,
    clearCartItems,
    removeProductFromCart,
    checkCartProductsStock,
    checkoutCart,
    updateStock
};