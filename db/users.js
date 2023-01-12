const db = require('./index.js');

const getUsers = (req, res, next) => {
    db.query("SELECT * FROM users", (error, results) => {
        if (error) {
            next(error);
        } else {
            res.status(200).json(results.rows);
        }
    })
}

// using an id that doesn't exist still returns an empty array. Remember this when you set up authorization, if
// data fetching uses this sort of querying.
const getUsersById = (req, res, next) => {
    const { id } = req.body;

    if (!id) {
        throw new Error('Please specify an ID');
    }

    db.query(`SELECT * FROM users WHERE id = ${id}`, (error, results) => {
        if (error) {
            next(error);
        } else {
            res.status(200).json(results.rows);
        }
    })
}

const addUser = (req, res, next) => {
    const { username, firstName, lastName, address, city, state, country } = req.body;

    const query = `INSERT INTO users (user_name, first_name, last_name, address, city, state, country)
        VALUES, (${username, firstName, lastName, address, city, state, country});`;
    
    db.query(query, (error, results) => {
        if (error) {
            next (error);
        } else {
            res.status(200).json('User created.');
        }
    });
}

module.exports = {
    getUsers,
    getUsersById
}