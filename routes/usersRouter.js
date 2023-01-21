const express = require('express');
const usersRouter = express.Router();

const { getUsers, getUserById, createUser, deleteUser } = require('../db/users');



//None
usersRouter.get('/', getUsers);
//req.body - userId
usersRouter.get('/:userId', getUserById);
//req.body - email, password, firstName, lastName, address, city, state (2), country (3)
usersRouter.post('/createUser', createUser);
//req.body - userId
usersRouter.delete('/deleteUser', deleteUser);



module.exports = usersRouter;