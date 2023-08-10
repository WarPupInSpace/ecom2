import 'dotenv/config'
import express, { Router } from 'express';
import mongoose from 'mongoose'
import AccountRouter from './apis/routes/account.route.js'
import ProductRouter from './apis/routes/product.route.js';
import morgan from 'morgan';
import { HandleError } from './middleware/handle.error.js';
import session from 'express-session';
import { default as connectMongoDBSession } from 'connect-mongodb-session';
import passport from 'passport';
const MongoDBStore = connectMongoDBSession(session);


mongoose.set('sanitizeFilter', true);

const app = express()
const port = 3000


//register middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan('tiny'));
app.use(passport.initialize());



const store = new MongoDBStore({
    uri: 'mongodb://127.0.0.1:27017/ecom2',
    collect: 'mysessions',
    expires: 1000 * 60 * 60 * 24,
    connectionOptions: {
        // added later
    }
});


store.on('error', function (error) {
    console.log(error);
})


app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24,
        secure: false,
    },
    unset: 'destroy',
    store: store
}));

app.use(passport.session());
// app.set('trust proxy' = true)


// resgister routes
app.use('/api', AccountRouter);
app.use('/api', ProductRouter);


app.get('/', (req, res, next) => {
    res.send("main page");
})

app.use(HandleError);

app.listen(port, () => console.log(`Example app listening on port ${port}!`));