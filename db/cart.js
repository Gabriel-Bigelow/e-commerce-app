const db = require('./index.js');

//Deprecated --- Create cart is now handled by a trigger on the database
// const createCart = (req, res, next) => {
//     const userId = res.locals.user.id;
    
//     const query = `INSERT INTO carts (user_id)
//     VALUES (${userId})
//     RETURNING *`;

//     db.query(query, (error, results) => {
//         if (error) {
//             throw error;
//         } else {
//             res.locals.cart = results.rows[0];
//             res.status(200).send(res.locals);
//         }
//     }) 
// }


//gets the total of each set of items and returns the total price of each set of items
const getCartProducts = (req, res, next) => {
    const { userId } = req.body;

    const query = `SELECT COUNT (product_id) AS quantity, product_id, name, SUM(price) AS total FROM cart_products
    JOIN carts
    ON carts.id = cart_products.cart_id
    JOIN products
    ON products.id = cart_products.product_id
    WHERE user_id = ${userId}
    GROUP BY (product_id, name);`;

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

    const query = `SELECT COUNT (product_id) AS quantity, SUM(price) AS total FROM cart_products
    JOIN carts
    ON carts.id = cart_products.cart_id
    JOIN products
    ON products.id = cart_products.product_id
    WHERE user_id = ${userId};`

    db.query(query, (error, results) => {
        if (error) {
            throw error;
        } else {
            res.locals.cartTotal = results.rows;
            res.status(200).send(res.locals);
        }
    })
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
            } else {
                console.log('product updated');
                console.log(results.rows);
            }
        })
    })

    res.status(201).send(newOrder);

}


// Deprecated --- delete cart is now handled by the deleteUser middleware
// const deleteCart = (req, res, next) => {
//     const { userId } = req.body;

//     const query = `WITH cartToDelete AS (
//         SELECT cart_id
//         FROM cart_products
//         JOIN carts
//         ON cart_id = carts.id
//         WHERE user_id = ${userId}
//       ),
//       productsDeleted AS (
//         DELETE FROM cart_products
//         WHERE cart_id IN (SELECT cart_id FROM cartToDelete)
//       )
//       DELETE FROM carts
//       WHERE user_id = ${userId};`;

//     db.query(query, (error, results) => {
//         if (error) {
//             throw error;
//         } else {
//             next();
//         }
//     })
// }


module.exports = {
    // createCart,
    getCartProducts,
    getCartTotal,
    clearCartItems,

    checkCartProductsStock,
    checkoutCart,
    updateStock
    // deleteCart
};