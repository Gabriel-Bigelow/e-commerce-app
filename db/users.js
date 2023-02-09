const db = require('./database.js');
const bcrypt = require('bcrypt');
const supabase = require('./database.js');


// Inserts a new user into the database and triggers an SQL function to create a cart associated with that user.
const registerUser = async (email, password) => {
    const { data, error } = await supabase.from('users')
    .insert([ {email:email, password:password } ])
    .select('*');

    return data[0];
}

//returns all rows from the users table
const getUsers = async (req, res, next) => {
    const { data, status, error } = await supabase.from('users').select();

    if (data) {
        res.status(status).send(data);
    } else {
        res.status(status).send(error);
    }
};

// using an id that doesn't exist still returns an empty array. Remember this when you set up authorization, if having undefined vs an empty array makes a difference.
const getUserById = async (req, res, next) => {
    if (!req.user) return res.status(401).send('User not logged in.');

    const userId = req.user.id;

    const { data, status, error } = await supabase.from('users').select().eq('id', userId);

    if (data) {
        res.status(status).send(data[0]);
    } else {
        res.status(status).send(error);
    }
};

const updateUser = async (req, res, next) => {
    if (!req.user) return res.status(401).send('User not logged in.');
    const userId = req.user.id;

    const { email, address, city, state, country, password } = req.body;


    if (state && state.length !== 2) return res.status(401).send('State must be 2 characters in length. Example: OH');
    if (country && country.length !== 3) return res.status(401).send('Country must be 3 characters in length. Example: USA');

    const values = {
        email: email,
        address: address,
        city: city,
        state: state,
        country: country
    };

    if (password) {
        const salt = await bcrypt.genSalt(10);
        const hash = bcrypt.hashSync(password, salt);
        values.password = hash;
    }

    const { data, status } = await supabase.from('users')
    .update(values)
    .eq('id', userId)
    .select('*');

    if (data.length > 0) {
        res.status(status).send(data[0]);
    } else {
        res.status(500).send('Something went wrong.');
    }
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