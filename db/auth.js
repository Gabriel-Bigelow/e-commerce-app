const db = require('./index');
const bcrpyt = require('bcrypt');

const registerUser = async (email, password) => {
    const query = `INSERT INTO users (email, password)
    VALUES ('${email}', '${password}')
    RETURNING id, email, password;`;

    const data = await db.query(query);
    return await data.rows[0];
}

const findUserByEmail = async (email) => {
    const query = `SELECT * FROM users
    WHERE email = '${email}'`;

    const data = await db.query(query);
    
    if (await data.rowCount == 0) return false;
    return await data.rows[0];
};

const findUserById = async (id) => {
    console.log(id);

    query = `SELECT * FROM users
    WHERE id = ${id}`;

    db.query(query, (error, results) => {
        if (error) {
            throw error;
        } else {
            return results.rows[0];
        }
    })
};

const matchPassword = (password) => {
    const saltRounds = 10;
}


module.exports = {
    registerUser,
    findUserByEmail,
    findUserById
}