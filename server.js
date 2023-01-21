const express = require('express');
const passport = require('passport');
const session = require('express-session');

const apiRouter = require('./routes/apiRouter');

const app = express();

//import data here
require('./config/passport');

const PORT = process.env.PORT || 4000;

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(
    session({
        secret: "secretGoesHere",
        saveUninitialized: false,
        resave: false,
    })
);

app.use(passport.initialize());
app.use(passport.session());

app.use('/api', apiRouter);














app.listen(PORT, () => {
    console.log(`Server is listening on ${PORT}`);
});