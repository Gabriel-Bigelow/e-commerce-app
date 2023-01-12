const db = require('./index.js');

const getCart = (req, res, next) => {
    const { id } = req.body;

    if (!id) {
        throw new Error('Please specify a cart ID.');
    }

    db.query(`SELECT name, COUNT (id), SUM (price) AS item_total
        FROM products
        JOIN cart_products
        ON products.id = cart_products.product_id
        WHERE cart_products.cart_id = ${id}
        GROUP BY (id);`, 
        (error, results) => {
            if (error) {
                res.send(error);
            } else {
                res.status(200).send(results.rows);
            }
    })
}


module.exports = {
    getCart
}