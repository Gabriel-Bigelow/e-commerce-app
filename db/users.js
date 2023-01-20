const db = require('./index.js');

//INSERTS A NEW ROW INTO USERS AND TRIGGERS AN SQL FUNCTION TO CREATE A CART ASSOCIATED WITH THE USER
const createUser = (req, res, next) => {
    const { email, password, firstName, lastName, address, city, state, country } = req.body;

    const query = `INSERT INTO users (email, first_name, last_name, address, city, state, country)
        VALUES ('${email}', '${password}' ,'${firstName}', '${lastName}', '${address}', '${city}', '${state}', '${country}')
        RETURNING *;`;
    
    db.query(query, (error, results) => {
        if (error) {
            throw error;
        } else {
            res.locals.user = results.rows[0];
            next();
        }
    });
};

//returns all rows from the users table
const getUsers = (req, res, next) => {
    const query = "SELECT * FROM users ORDER BY id ASC";

    db.query(query, (error, results) => {
        if (error) {
            throw error;
        } else {
            res.status(200).json(results.rows);
        }
    })
};

// using an id that doesn't exist still returns an empty array. Remember this when you set up authorization, if having undefined vs an empty array makes a difference.
const getUserById = (req, res, next) => {
    const { userId } = req.params;

    const query = `SELECT * FROM users WHERE id = ${userId} AND active = true`

    db.query(query, (error, results) => {
        if (error) {
            throw error;
        } else {
            res.status(200).json(results.rows);
        }
    })
};


// This is probably bad because it deletes orders. Better solution is to just make the user's data null, but leave user_id untouched.
const deleteUser = (req, res, next) => {
    const { userId } = req.body;

    //make deletes on all 5 tables related directly to the user's data
    const query = `WITH deleted_cart_products AS (
            DELETE FROM cart_products
            USING carts
            WHERE cart_products.cart_id = carts.id AND carts.user_id = ${userId}
        )
        UPDATE users
        SET email = NULL, first_name = NULL, last_name = NULL, address = NULL, city = NULL, state = NULL, country = NULL, active = false, password = NULL
        WHERE id = ${userId}
        RETURNING *;`;

    db.query(query, (error, results) => {
        if (error) {
            throw error;
        } else {
            res.status(200).send(results.rows);
        }
    })
}

module.exports = {
    createUser,
    getUsers,
    getUserById,
    deleteUser
}