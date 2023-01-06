const express = require('express');
const router = express.Router();

module.exports = (app) => {

    app.use('/auth', router);

    router.post('/register', async (req, res, next) => {
        try {
            //assign the inputted data to a variable (from req);

            //assign the response to a result of calling the authentication function with the data variable as an argument

            //res.status(200).send(response);
        } catch (err) {
            next (err);
        }
    });

    router.post('login', async (req, res, next) => {
        try {
            //assign the inputted username and password to a variable (from req);

            //assign the response to a result of calling the login function with the username and password as arguments

            //res.status(200).send(response);
        } catch (err) {
            next(err);
        }
    });

    
}