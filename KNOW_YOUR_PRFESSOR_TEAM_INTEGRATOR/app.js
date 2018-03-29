let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let bodyParser = require('body-parser');
let exphbs = require('express-handlebars');
let expressValidator = require('express-validator');
let flash = require('connect-flash');
let session = require('express-session');
let passport = require('passport');
let LocalStrategy = require('passport-local').Strategy;
let Handlebars = require('handlebars');

//Routes 
let routes = require('./routes/index');
let users = require('./routes/users');
let ratings = require('./routes/newratings');
let terms = require('./routes/terms');
let courses = require('./routes/courses');


// Init App

let app = express();

// View Engine 

app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', exphbs({ defaultLayout: 'layout' }));
app.set('view engine', 'handlebars')

//Custom function for loading ratings glyphycon
Handlebars.registerHelper('times', function (n) {
    n = parseInt(n);
    let accum = '';
    for(var i = 0; i < n; i++)
        accum += '<span class="glyphicon glyphicon-star" aria-hidden="true"></span>';
    return accum;
});

//bodyParser Middleware 

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

//Set Static
app.use(express.static(path.join(__dirname, 'public')));


//Express Session
app.use(session({
    secret: 'secret',
    saveUninitialized: true,
    resave: false
}));

// passport init 

app.use(passport.initialize());
app.use(passport.session());

//Express Validator
app.use(expressValidator({
    errorFormatter: function (param, msg, value) {
        let namespace = param.split('.')
            , root = namespace.shift()
            , formParam = root;

        while (namespace.length) {
            formParam += '[' + namespace.shift() + ']';
        }
        return {
            param: formParam,
            msg: msg,
            value: value
        };
    }
}));

// connect flash
app.use(flash());


// global variable
app.use(function (req, res, next) {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null;
    next();
});

//Registration of routes
app.use('/', routes);
app.use('/users', users);
app.use('/ratings', ratings);
app.use('/terms', terms);
app.use('/courses', courses);

//set port
app.set('port', (process.env.PORT || 3000));

app.listen(app.get('port'), function () {
    console.log("We've now got a server!");
    console.log('KNOW YOUR PROFESSOR is up and running on http://localhost:3000');
}); 