import passport from 'passport'
import LocalStrategy from 'passport-local';
import AccountModel from '../../apis/models/account.model.js';
import bcrypt from 'bcrypt';


/*
    local strategy 
    queries database for hashed password by username
    compare password + pepperstring to passwordhash
    get and return user details
    todo : set session
*/
passport.use(new LocalStrategy(
    async function (username, password, done) {
        let response = await AccountModel.findOne({ username: username }, 'password')
            .then((data) => {return { ok: true, data: data }})
            .catch((err) => { return { ok: false, err: err } })
        if (!response.ok) {
            console.log(response.err);
            return done(response.err)
        }
        if (!response.data) {
            return done(null, false);
        }
        const passwordhash = response.data.password;
        response = await bcrypt.compare(password + process.env.PASSWORD_PEPPER_STRING_V1, passwordhash)
        .then(bool => { return bool })
        .catch(() => { return false })
        
        if (!response) {
            return done(null, false)
        }
        const user = await AccountModel.findOne({ username }, 'username name.firstname name.lastname');
        return done(null, user);

    }
))

passport.serializeUser(function (user, cb) {
    process.nextTick(function () {
        return cb(null, {
            id: user.id,
            username: user.username,
            firstname: user.name.firstname,
            lastname: user.name.lastname
        });
    });
});

passport.deserializeUser(function (user, cb) {
    process.nextTick(function () {
        return cb(null, user);
    });
});
