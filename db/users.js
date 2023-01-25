const db = require('./index.js');
const bcrypt = require('bcrypt');
const e = require('express');
const { statement } = require('@babel/template');

// Inserts a new user into the database and triggers an SQL function to create a cart associated with that user.
const registerUser = async (email, password) => {
    const query = `INSERT INTO users (email, password)
    VALUES ('${email}', '${password}')
    RETURNING id, email, password;`;

    const data = await db.query(query);
    return await data.rows[0];
}

//returns all rows from the users table
const getUsers = (req, res, next) => {
    const query = `SELECT * FROM users 
        WHERE active = true
        ORDER BY id ASC`;

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
    if (!req.user) return res.status(401).send('User not logged in.');

    const userId = req.user.id;

    const query = `SELECT * FROM users WHERE id = ${userId} AND active = true`

    db.query(query, (error, results) => {
        if (error) {
            throw error;
        } else if (results.rows.length < 1) {
            res.status(404).send("User not found.")
        }
        else {
            res.status(200).json(results.rows[0]);
        }
    })
};

const updateUser = async (req, res, next) => {
    if (!req.user) return res.status(401).send('User not logged in.');
    const userId = req.user.id;

    const { email, firstName, lastName, address, city, state, country, password } = req.body;


    if (state && state.length !== 2) return res.status(401).send('State must be 2 characters in length. Example: OH');
    if (country && country.length !== 3) return res.status(401).send('Country must be 3 characters in length. Example: USA');

    let values = [];
    
    if (email) values.push(`email = '${email}'`)
    if (firstName) values.push(`first_name = '${firstName}'`);
    if (lastName) values.push(`last_name = '${lastName}'`);
    if (address) values.push(`address = '${address}'`);
    if (city) values.push(`city = '${city}'`);
    if (state) values.push(`state = '${state}'`);
    if (country) values.push(`country = '${country}'`);
    if (password) {
        const salt = await bcrypt.genSalt(10);
        const hash = bcrypt.hashSync(password, salt);
        values.push(`password = '${hash}'`);
    }
    console.log(values);

    values = values.join(', ');

    const query = `UPDATE users
    SET ${values}
    WHERE id = ${userId}
    RETURNING *`;

    db.query(query, (error, results) => {
        if (error) {
            throw error;
        } else {
            res.status(200).send(results.rows[0]);
        }
    });
}


// sets specified row's data as NULL for all values, except id, and marks the account inactive.
const deleteUser = (req, res, next) => {
    if (!req.user) return res.status(401).send('User not logged in.');

    const userId = req.user.id;

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
            req.logout((err) => {
                if (err) {
                    throw err;
                } else {
                    res.status(200).send(results.rows[0]);
                }
            });
        }
    })
}

module.exports = {
    registerUser,
    getUsers,
    getUserById,
    updateUser,
    deleteUser
}