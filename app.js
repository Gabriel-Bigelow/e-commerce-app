const express = require('express');
const passport = require('passport');
const session = require('express-session');
const memoryStore = new session.MemoryStore();

const apiRouter = require('./routes/apiRouter');

const app = express();

//import data here
require('./config/passport');

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(
    session({
        secret: "secretGoesHere",
        saveUninitialized: false,
        resave: false,
        store: memoryStore
    })
);

app.use((req, res, next) => {
    console.log(`${req.method}:${req.url}`);
    next();
});
app.use((req, res, next) => {
    // console.log(memoryStore);
    next();
})

app.use(passport.initialize());
app.use(passport.session());

app.use('/api', apiRouter);

module.exports = app;