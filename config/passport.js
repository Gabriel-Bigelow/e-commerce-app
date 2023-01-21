const passport = require('passport');
const bcrypt = require('bcrypt');
const { findUserByEmail, findUserById, registerUser } = require('../db/auth');
const { createUser } = require('../db/users');
const LocalStrategy = require('passport-local').Strategy;

passport.use(
    'register',
    new LocalStrategy({
        usernameField: 'email',
    },
    async (email, password, done) => {
        const salt = await bcrypt.genSalt(10);
        const hash = bcrypt.hashSync(password, salt);

        const user = await registerUser(email, hash);

        done(null, user);
    })
)

passport.use(
    'login',
    new LocalStrategy({
        usernameField: 'email',
    }, 
    async (email, password, done) => {

        const user = await findUserByEmail(email);

        if (!user) {
            done(null, false);
        }

        const matchedPassword = await bcrypt.compare(password, user.password);
        if (!matchedPassword) {
            return done(null, false);
        }

        done(null, user)
    })
);

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    const user = await findUserById(id);

    done(null, user);
})