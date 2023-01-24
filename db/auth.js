const db = require('./index');
const bcrpyt = require('bcrypt');



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
    findUserByEmail,
    findUserById
}