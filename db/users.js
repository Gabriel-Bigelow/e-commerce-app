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

module.exports = {
    getUsers,
    getUsersById
}