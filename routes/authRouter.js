const express = require('express');
const authRouter = express.Router();
const passport = require('passport');

authRouter.post('/login', passport.authenticate('login'), (req, res) => {
    res.status(200).send(req.user);
})

authRouter.post('/register', passport.authenticate('register'), (req, res) => {
    res.status(200).send(req.user);
})


module.exports = authRouter