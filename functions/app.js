const express = require('express');
const passport = require('passport');
const session = require('express-session');
const serverless = require('serverless-http');
const memoryStore = new session.MemoryStore();
const cors = require('cors');
require('dotenv').config();

const PORT = process.env.PORT || 4000;
const apiRouter = require('./routes/apiRouter');

const app = express();

//import data here
require('./config/passport');

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(cors({
    origin: "http://localhost:3000",
    credentials: true
}));

app.use(
    session({
        secret: process.env.SESSION_SECRET,
        saveUninitialized: false,
        resave: true,
        store: memoryStore,
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

app.listen(PORT, () => {
    console.log(`Server is listening on ${PORT}`);
});

module.exports.handler = serverless(app);