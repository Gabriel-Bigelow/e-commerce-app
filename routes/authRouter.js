const express = require('express');
const authRouter = express.Router();
const passport = require('passport');

authRouter.post('/login', passport.authenticate('login'), (req, res) => {
    const { id, email, address, city, country, state, zip, first_name, last_name } = req.user;
    const user = { id, email, address, city, country, state, zip, first_name, last_name };
    res.status(200).send(user);
})

authRouter.post('/register', passport.authenticate('register'), (req, res) => {
    res.status(200).send('Success.');
});

authRouter.get('/logout', (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        res.status(200).send('Successful logout');
    })
})


module.exports = authRouter