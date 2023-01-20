const express = require('express');
const usersRouter = express.Router();
const bodyParser = require('body-parser').json();

const { getUsers, getUserById, createUser, deleteUser } = require('../db/users');



//None
usersRouter.get('/getUsers', getUsers);
//req.body - userId
usersRouter.get('/:userId', bodyParser, getUserById);
//req.body - email, password, firstName, lastName, address, city, state (2), country (3)
usersRouter.post('/createUser', bodyParser, createUser);
//req.body - userId
usersRouter.delete('/deleteUser', bodyParser, deleteUser);



module.exports = usersRouter;