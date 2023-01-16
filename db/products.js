const db = require('./index.js');

const createProduct = (req, res, next) => {
    const { name, price, stock } = req.body;

    const query = `INSERT INTO products (name, price, stock)
    VALUES ('${name}', ${price}, ${stock})
    RETURNING *`;

    db.query(query, (error, results) => {
        if (error) {
            throw error;
        } else {
            res.status(200).send(results.rows);
        }
    })
};

//returns all rows from the products table
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

//returns the row from the products table whose id matches productId
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
            res.status(200).send(results.rows);
        }
    });
}

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
            res.status(200).send(results.rows);
        }
    })
}

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
            res.status(200).send(results.rows);
        }
    })
}

//MAYBE SHOULD BE CHANGED
//can be changed to take the userId, rather than the cartId
const addProductToCart = (req, res, next) => {
    const { cartId } = req.body;
    const { productId } = req.params;

    const query = `INSERT INTO cart_products (cart_id, product_id)
    VALUES (${cartId}, ${productId})
    RETURNING *`;

    db.query(query, (error, results) => {
        if (error) {
            throw error;
        } else {
            res.status(200).send(results.rows);
        }
    })
}

//this can be changed to take the userId from the request body, rather than the the cartId
const removeProductFromCart = (req, res, next) => {
    const { cartId, productId } = req.body;

    const query = `DELETE FROM cart_products (product_id)
    WHERE cart_id = ${cartId} AND product_id = ${productId}
    RETURNING *`;

    db.query(query, (error, results) => {
        if (error) {
            throw error;
        } else {
            res.status(200).send(results.rows);
        }
    })
}



module.exports = {
    createProduct,
    getProducts,
    getProductById,
    updateProduct,
    activateProduct,
    deactivateProduct,
    addProductToCart,
    removeProductFromCart
}