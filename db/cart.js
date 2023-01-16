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
//MAYBE SHOULD BE CHANGED
//can be changed to take the userId, rather than the cartId
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

    checkoutCart
    // deleteCart
};