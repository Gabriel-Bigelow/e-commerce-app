const { Pool } = require('pg');

const db = new Pool({
    host: "localhost",
    port: 5432,
    database: 'e-commerce-backend-data',
    user: 'postgres',
    password: 'postgres'
})

const query = (text, params, callback) => db.query(text, params, callback);

module.exports = {
    query
}