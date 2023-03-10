const e = require('express');
const db = require('./index.js');

// add a product to the products table portion of the database and mark it as active and ready to be sold
const createProduct = (req, res, next) => {
    const { name, price, stock } = req.body;

    const query = `INSERT INTO products (name, price, stock)
    VALUES ('${name}', ${price}, ${stock})
    RETURNING *`;

    db.query(query, (error, results) => {
        if (error) {
            throw error;
        } else {
            res.status(200).send(results.rows[0]);
        }
    })
};

// returns all rows from the products table
const getProducts = (req, res, next) => {
    const query = `SELECT * FROM products 
    WHERE active = true
    ORDER BY id ASC`;

    db.query(query, (error, results) => {
        if (error) {
            throw error;
        } else {
            res.status(200).send(results.rows);
        }
    })
};

// returns the row from the products table whose id matches productId
const getProductById = (req, res, next) => {
    const { productId } = req.params;

    const query = `SELECT * FROM products 
    WHERE id = ${productId} AND active = true`;

    db.query(query, (error, results) => {
        if (error) {
            throw error;
        } else {
            res.status(200).send(results.rows[0]);
        }
    })
}

// if a stock is updated, updates the current row
// if name or price changes, a new item will be created and the changed values will replace the old values, otherwise all values are copied and a new id is given to the product. (Maintains database integrity
// by not making changes to past orders or cart items)
const updateProduct = (req, res, next) => {
    const { productId, name, price, stock } = req.body;
    
    let query;

    // if name or price changes, create a new product row and deactivate the old one | else, just update the current entry
    if (name || price) {
        const selectItems = `VALUES (
            ${name ? `'${name}'` : "(SELECT name FROM old_product)"}, 
            ${price ? price : "(SELECT price FROM old_product)"}, 
            ${stock ? stock : "(SELECT stock FROM old_product)"})`;

        query = `WITH old_product AS (
                UPDATE products
                SET active = false
                WHERE id = ${productId}
                RETURNING name, price, stock
            )
            INSERT INTO products (name, price, stock) ${selectItems}
            RETURNING *;`
    } else if (stock) {
        query = `
            UPDATE products
            SET stock = ${stock}
            WHERE id = ${productId}
            RETURNING *;`
    }

    db.query(query, (error, results) => {
        if (error) {
            throw error;
        } else {
            res.status(200).send(results.rows[0]);
        }
    });
}

// reactivate discontinued item
const activateProduct = (req, res, next) => {
    const { productId } = req.body;

    const query = `UPDATE products
    SET active = true
    WHERE id = ${productId}
    RETURNING *`;

    db.query(query, (error, results) => {
        if (error) {
            throw error
        } else {
            res.status(200).send(results.rows[0]);
        }
    })
}

// deactivate discontinued item
const deactivateProduct = (req, res, next) => {
    const { productId } = req.body;

    const query = `UPDATE products
    SET active = false
    WHERE id = ${productId}
    RETURNING *`;

    db.query(query, (error, results) => {
        if (error) {
            throw error;
        } else {
            res.status(200).send(results.rows[0]);
        }
    })
}

//Add or update a product type in a user's using the productId and quantity property from the request, if the requested quantity is lower or equal to the amount of available stock
const addProductToCart = (req, res, next) => {
    if (!req.user) return res.status(401).send('User not logged in.');
    
    const userId = req.user.id;
    const { quantity } = req.body;
    const { productId } = req.params;
    const product = res.locals.product;

    

    if (!quantity) return res.status(400).send('Item quantity not specified.');
    
    let query;

    if (product.stock === null) {
        return res.status(404).send('itemId is invalid.');
    }

    //if product is not yet in cart, insert a row
    if (!product.quantity) {
        if (product.stock >= quantity) {
            query = `WITH user_cart AS (
                    SELECT id AS cart_id FROM carts
                    WHERE user_id = ${userId}
                )
                INSERT INTO cart_products (cart_id, product_id, quantity)
                VALUES ((SELECT cart_id FROM user_cart), ${productId}, ${quantity})
                RETURNING *`;
        } else {
            return res.status(403).send('There are not that many items in stock.');
        }
    //if product is already in cart, update that row
    } else {
        if (product.stock >= quantity) {
            query = `WITH user_cart AS (
                SELECT id AS cart_id FROM carts
                WHERE user_id = ${userId}
            )
            UPDATE cart_products
            SET quantity = ${quantity}
            WHERE product_Id = ${productId} AND cart_id = (SELECT cart_id FROM user_cart)
            RETURNING *`;
        } else {
            return res.status(403).send('There are not that many items in stock.');
        }
    }

    db.query(query, (error, results) => {
        if (error) {
            throw error;
        } else {
            res.status(200).send(results.rows[0]);
        }
    })
}


// Checks to make sure a single product is in stock before adding it to a user's cart. This will prevent most errant orders where a user tries to buy more items than are available.
const checkSingleProductStock = (req, res, next) => {
    if (!req.user) return res.status(401).send('User not logged in.');

    const { productId } = req.params;
    const userId = req.user.id;

    const query = `SELECT product_id, quantity, stock FROM carts
    JOIN users
    ON carts.user_id = users.id
    JOIN cart_products
    ON carts.id = cart_products.cart_id
    JOIN products
    ON cart_products.product_id = products.id
    WHERE users.id = ${userId} AND product_id = ${productId};`;

    db.query(query, (error, results) => {
        if (error) {
            throw error;
        } else {
            res.locals.product = results.rows[0];
            if (res.locals.product) {
                next();
            } else {
                db.query(`SELECT stock FROM products WHERE id = ${productId}`, (error, results) => {
                    if (error) {
                        throw error;
                    } else {
                        res.locals.product = results.rows[0];
                        next();
                    }
                })
            }
        }
    });
};



module.exports = {
    createProduct,
    getProducts,
    getProductById,
    updateProduct,
    activateProduct,
    deactivateProduct,
    addProductToCart,
    checkSingleProductStock
}