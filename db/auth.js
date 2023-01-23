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
    
    if (await data.rows.length === 0) return false;
    return await data.rows[0];
};

const findUserById = async (id) => {

    query = `SELECT * FROM users
    WHERE id = ${id}`;

    const data = await db.query(query);

    if (await data.rows.length === 0) return false;
    return await data.rows[0];
};


module.exports = {
    registerUser,
    findUserByEmail,
    findUserById
}