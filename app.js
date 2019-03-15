//dotEnv
require('dotenv').config();

const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const bodyParser = require('body-parser');
const session = require('express-session');
const passport = require('passport');
const flash = require('connect-flash');
const methodOverride = require('method-override');

const indexRoutes = require('./routes/index');
const userRoutes = require('./routes/user');
const seedDB = require('./seed');

//SeedDB
// seedDB();

const app = express();

//Flash
app.use(flash());


//BodyParser;
app.use(bodyParser.urlencoded({ extended: true }));

//Method-Override
app.use(methodOverride('_method'));

//Db
const {mongoose} = require('./db/mongoose');

//Public
app.use(express.static(__dirname + '/public/'));

//Ejs
app.use(expressLayouts);
app.set('view engine', 'ejs');

//Moment
app.locals.moment = require('moment');

//Passport Config
require('./config/passport')(passport);

//PassPort Config
app.use(session({
    secret: 'Cuttie Cat',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

//MiddleWare --after passport config
app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash('error');
    res.locals.warn = req.flash('warn');
    res.locals.success = req.flash('success');
    res.locals.moment = require("moment");
    next();
});



//Routes
app.use('/', indexRoutes);
app.use('/', userRoutes);

const port = process.env.PORT || 3000;
app.listen(port, (req, res) => {
   console.log(`Server has Started on Port ${port}`); 
});

