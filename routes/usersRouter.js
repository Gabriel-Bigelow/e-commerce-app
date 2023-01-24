const express = require('express');
const usersRouter = express.Router();

const { getUsers, getUserById, deleteUser, updateUser } = require('../db/users');



//None --- gets all users information.
usersRouter.get('/', getUsers);

// gets user information for Passport user that is currently logged in
usersRouter.get('/me', getUserById);

// updates user information for passport user that is currently logged in
//req.body --- email, firstName, lastName, address, city, state, country, password
usersRouter.put('/updateUser', updateUser);

//req.body - userId --- marks all user data as null, except for userId, marks the account as inactive, and logs the Passport user out.
usersRouter.delete('/deleteUser', deleteUser);



module.exports = usersRouter;

// // req.body - email, password, firstName, lastName, address, city, state (2), country (3)
//deprecated --- handled by registerUser now
//usersRouter.post('/createUser', createUser);