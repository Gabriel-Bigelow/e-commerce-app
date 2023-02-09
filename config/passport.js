const passport = require('passport');
const bcrypt = require('bcrypt');
const { findUserByEmail, findUserById } = require('../db/auth');
const { registerUser } = require('../db/users');
const LocalStrategy = require('passport-local').Strategy;

passport.use(
    'register',
    new LocalStrategy({
        usernameField: 'email',
    },
    async (email, password, done) => {
        if (!email || !password) {
            throw new Error ('email or password field left blank');
        }
        const salt = await bcrypt.genSalt(10);
        const hash = bcrypt.hashSync(password, salt);

        const foundUser = await findUserByEmail(email);
        if (foundUser) {
            return done(null, false);
        }
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
            return done(null, false);
        }

        const matchedPassword = await bcrypt.compare(password, user.password);
        if (!matchedPassword) {
            return done(null, false);
        }

        done(null, user)
    })
);

passport.use(
    'logout',
    new LocalStrategy ( { usernameField: 'email' },
        async (username, password, done) => {
            return done(null, false);
        }
    )
);







passport.serializeUser((user, done) => {
    console.log('serializing user ' + user.id);
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    const user = await findUserById(id);
    console.log(`deserialize userId: ${id}`);

    done(null, user);
})