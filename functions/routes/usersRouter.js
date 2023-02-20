const express = require('express');
const usersRouter = express.Router();

const { getUsers, getUserById, deleteUser, updateUser, getUserByEmail } = require('../db/users');



// None --- gets all users information.
usersRouter.get('/', getUsers);

usersRouter.get('/userByEmail/:email', getUserByEmail);

// gets user information for Passport user that is currently logged in
usersRouter.get('/me', getUserById);

// updates user information for passport user that is currently logged in
// req.body --- email, firstName, lastName, address, city, state, country, password
usersRouter.put('/updateUser', updateUser);

// marks all current user data as null, except for userId, marks the account as inactive, and logs the Passport user out.
usersRouter.delete('/deleteUser', deleteUser);



module.exports = usersRouter;