import express from 'express';
import dotenv from 'dotenv';
import path from 'node:path';
import session from 'express-session';
import connectPgSimple from 'connect-pg-simple';
import { pool } from './db/pool.js';
import { passport, addCurrentUserToLocals } from './config/passport.js';
import { signUpRouter } from './routes/signUpRouter.js';
import { loginRouter } from './routes/loginRouter.js';
dotenv.config();

const app = express();
// looks for views in views folder
const __dirname = path.resolve();
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
// enable form params
app.use(express.urlencoded({ extended: true }));
// serve assets from public folder
const assetsPath = path.join(__dirname, 'public');
app.use(express.static(assetsPath));
// session store in DB
const pgSession = connectPgSimple(session);
app.use(session({ 
    store: new pgSession({
        pool: pool,
        createTableIfMissing: true,
    }),
    secret: process.env.SECRET, 
    resave: false, 
    saveUninitialized: false,
    cookie: { maxAge: 5 * 60 * 1000 } // 5 minutes
}));
// passport setup
app.use(passport.session());
app.use(addCurrentUserToLocals);

// routes
app.get('/', (req, res) => {
    res.render('index');
});
app.use('/sign-up', signUpRouter);
app.use('/login', loginRouter);

// init server
const PORT = 3000;
app.listen(PORT, () => console.log(`listening on port: ${PORT}!`));
