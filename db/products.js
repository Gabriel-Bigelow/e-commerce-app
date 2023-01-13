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
}

const deleteProduct = (req, res, next) => {
    const { productId } = req.body;

    const query = `DELETE FROM products
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

const removeProductFromCart = (req, res, next) => {
    const { cartId, productId } = req.body;

    //check this for redundancy 
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
    deleteProduct,
    addProductToCart,
    removeProductFromCart
}