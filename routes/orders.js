const express = require('express');
const router = express.Router();

module.exports = (app) => {
    app.use('/orders', router);

    router.get('/', async (req, res, next) => {
        try {
            
        } catch (err) {
            next(err);
        }
    })
}