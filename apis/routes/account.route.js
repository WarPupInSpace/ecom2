import Router from 'express';
import { body, validationResult, matchedData, checkSchema } from 'express-validator';
import {
    CheckIfUsernameExists,
    CheckIfEmailExists,
    CreateAccount,
    DeleteAccount,
    VerifyAccount,
    UpdateAccount,
    GetAccount
} from '../controllers/account.controller.js';
import passport from 'passport';
import '../../utils/auth.strategies/local.js';

const AccountRouter = Router();

//path to asign to /account 

// requires session setup and authentication action
AccountRouter.post('/login', passport.authenticate('local'), (req, res) => {
    res.status(200).json({ user: req.user.username });
});


AccountRouter.get('/logout', (req, res, next) => {
    req.logout(function (err) {
        if (err) { return next(err) }
    })
    res.send({ msg: 'logged out' });
})


// to refactor as checkschema object literal
const registerBodyValidation = [
    body('*', 'all fields required').not().isEmpty().bail()
    ,
    body('email').trim().isEmail().normalizeEmail({ all_lowercase: true })
        .withMessage('type must be of email').bail()
        .custom(async email => {
            const emailExists = await CheckIfEmailExists(email);
            if (emailExists) throw new Error('E-mail already in use')
        })
    ,
    body('username').toLowerCase().isAlphanumeric()
        .withMessage('type must be alphanumeric').bail()
        .custom(async username => {
            const userExists = await CheckIfUsernameExists(username);
            if (userExists) throw new Error('username already exists');
        })
    ,
    body('password', 'password must contain ...')
    ,
    body('firstname', 'invalid name').trim().isAlpha()
        .withMessage('must be alpha characters').bail()
        .toLowerCase()
    ,
    body('lastname', 'invalid surname').trim().isAlpha()
        .withMessage('must be alpha characters').bail()
        .toLowerCase()
    ,
    body('age').isInt({ min: 18, max: 100, allow_leading_zeroes: false })
]


/* 
    register a user account
    validate input,
    create user account
    return message
*/
AccountRouter.post('/register', registerBodyValidation, (req, res, next) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
        res.status(400).send({ errors: result.array() })
        return;
    }
    const data = matchedData(req);
    const accountCreated = CreateAccount(data);
    if (!accountCreated) {
        const err = new Error();
        next(err);
    }
    res.status(201).send({ msg: 'account created' });
})



// check if in session
AccountRouter.all(['/account', '/account/*'], (req, res, next) => {
    if (req.user) {
        next();
    } else {
        const err = new Error('Access denied. Please login');
        err.status = 403;
        next(err);
    }
})

AccountRouter.get('/account', async (req, res, next) => {
   const response = await GetAccount(req.user.username);
   if (!response.ok){
    console.log(response.err);
    const err = new Error();
    return next(err);
   }
   const user = response.user;
    res.status(200).json({user})
});


const inputValid = checkSchema({
    trim: true,
    username: {
        isAlpha: true,
    },
    password: {
        isAlphanumeric: true
    },
    firstname: {
        isAlpha: true,
    },
    lastname: {
        isAlpha: true,
    },
    email: {
        isEmail: true
    }
},
    ['body']
)

// verify user on routes for action delete and edit
AccountRouter.all(['/account/delete', '/account/edit'], inputValid, async (req, res, next) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
        res.status(401).json({ err: result.array() })

    }
    const data = matchedData(req);
    const username = data.username;
    const password = data.password;
    console.log(password);
    const verify = await VerifyAccount(username, password);
    if (!verify.ok) {
        const err = new Error('username or password incorrect');
        err.status = 401;
        return next(err);
    }
    req.data = data
    next();
})

AccountRouter.put('/account/edit', async (req, res, next) => {
    const {firstname, lastname, email} = req.data;
    const verifyUpdate = UpdateAccount(firstname, lastname, email);
    res.send("update details /account/edit");
});



// need to sanitize data, using post as validation of username and password must be entered
AccountRouter.post('/account/delete', async (req, res, next) => {
    const username = req.data.username;
    const accountRemoved = await DeleteAccount(username);
    if (!accountRemoved.ok) {
        console.log(accountRemoved.err);
        const err = new Error();
        return next(err)
    }
    req.logOut(function (err) {
        if (err) { console.log(err) }
    })
    res.status(200).json({ msg: 'account deleted' });
})


export default AccountRouter;

