const db = require('./index.js');

const createUser = (req, res, next) => {
    const { username, firstName, lastName, address, city, state, country } = req.body;

    const query = `INSERT INTO users (user_name, first_name, last_name, address, city, state, country)
        VALUES ('${username}', '${firstName}', '${lastName}', '${address}', '${city}', '${state}', '${country}')
        RETURNING *;`;
    
    db.query(query, (error, results) => {
        if (error) {
            next (error);
        } else {
            res.status(200).json(results.rows);
        }
    });
};

const deleteUser = (req, res, next) => {
    const { userId } = req.body;

    const query = `DELETE FROM users
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



const getUsers = (req, res, next) => {
    db.query("SELECT * FROM users", (error, results) => {
        if (error) {
            next(error);
        } else {
            res.status(200).json(results.rows);
        }
    })
};

// using an id that doesn't exist still returns an empty array. Remember this when you set up authorization, if
// data fetching uses this sort of querying.
const getUserById = (req, res, next) => {
    const { userId } = req.body;

    if (!userId) {
        throw new Error('Please specify an ID');
    }

    const query = `SELECT * FROM users WHERE id = ${userId}`

    db.query(query, (error, results) => {
        if (error) {
            next(error);
        } else {
            res.status(200).json(results.rows);
        }
    })
};

module.exports = {
    createUser,
    deleteUser,
    getUsers,
    getUserById    
}