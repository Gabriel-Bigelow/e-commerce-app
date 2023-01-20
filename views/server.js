const express = require('express');
const passport = require('passport');
const session = require('express-session');
const store = new session.MemoryStore();
const LocalStrategy = require('passport-local').Strategy;

const apiRouter = require('../routes/apiRouter');

const app = express();

//import data here



const PORT = process.env.PORT || 4000;


app.listen(PORT, () => {
    console.log(`Server is listening on ${PORT}`);
});

app.use('/api', apiRouter);
//     session({
//         secret: "f4z4gs$Gcg",
//         cookie: { maxAge: 1000 * 60 * 60 * 24, secure: true, sameSite: "none"},
//         saveUninitialized: false,
//         resave: false,
//         sameSite: 'none'
//     })
// );

// app.use(passport.initialize());

// app.use(passport.session());

// passport.use(new LocalStrategy(
//     (username, password, done) => {

//     }
// ))

app.post('/login', passport.authenticate('local', { failureRedirect : '/login'}), (req, res) => {
    res.send(send("Successful login!"));
});