const express = require('express');

const app = express();

//import data here



const PORT = process.env.PORT || 4000;

app.use(express.static('public'));

app.listen(PORT, () => {
    console.log(`Server is listening on ${PORT}`);
})