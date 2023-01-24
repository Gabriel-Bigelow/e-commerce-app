const db = require('./index.js');
const bcrypt = require('bcrypt');
const e = require('express');

//INSERTS A NEW ROW INTO USERS AND TRIGGERS AN SQL FUNCTION TO CREATE A CART ASSOCIATED WITH THE USER

// DEPRECATED --- handled by auth now
/*const createUser = (req, res, next) => {
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
};*/

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
    if (req.user) return res.status(401).send('User not logged in.');
    const userId = req.user.id;

    const { email, firstName, lastName, address, city, state, country, password } = req.body;

    let values = '';

    if (email) values = values.concat(`email = '${email}' `)
    if (firstName) values = values.concat(`first_name = '${firstName}' `);
    if (lastName) values = values.concat(`last_name = '${lastName}' `);
    if (address) values = values.concat(`address = '${address}' `);
    if (city) values = values.concat(`city = '${city}' `);
    if (state) values = values.concat(`state = '${state}' `);
    if (country) values = values.concat(`country = '${country}' `);
    if (password) {
        const salt = await bcrypt.genSalt(10);
        const hash = bcrypt.hashSync(password, salt);
        values = values.concat(`password = ${hash} `);
    }

    const query = `UPDATE users
    SET ${values}
    WHERE id = ${userId}`;

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