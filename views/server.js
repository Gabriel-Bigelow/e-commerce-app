const express = require('express');

const app = express();

//import data here



const PORT = process.env.PORT || 4000;


app.listen(PORT, () => {
    console.log(`Server is listening on ${PORT}`);
});


app.get('/', async (req, res, next) => {
    try {       
        res.status(200).send('This is a test of the homepage get request');
    } catch (err) {
        next (err);
    }
})