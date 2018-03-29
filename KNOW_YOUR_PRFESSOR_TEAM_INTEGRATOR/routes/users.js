let express = require('express');
let router = express.Router();
let passport = require('passport');
let LocalStrategy = require('passport-local').Strategy;
let User = require('../models/user');
let common = require('./common');
let rating = require('../models/rating');
let course = require('../models/course');

// Register
router.get('/register', function (req, res) {
    res.render('register');
});

//Login
router.get('/login', function (req, res) {
    res.render('login');
});

//Register User
router.post('/register', function (req, res) {
    let newUser = User;

    newUser.name = req.body.txtName;
    newUser.email = req.body.txtEmail;
    newUser.username = req.body.txtUsername;
    newUser.password = req.body.txtPassword;
    newUser.password2 = req.body.txtPassword2;
    newUser.securityQuestion = req.body.ddnSecQuestion;
    newUser.securityAnswer = req.body.txtSecurityAnswer;

    //Validation
    req.checkBody('txtName', 'Name is required..').notEmpty();
    req.checkBody('txtEmail', 'Email is required..').notEmpty();
    req.checkBody('txtEmail', 'Email is required..').isEmail();
    req.checkBody('txtUsername', 'Username is required..').notEmpty();
    req.checkBody('txtPassword', 'Password is required..').notEmpty();
    req.checkBody('txtPassword', 'Password do not match..').equals(req.body.txtPassword2);
    req.checkBody('ddnSecQuestion', 'Security question must be selcected.').notEmpty();
    req.checkBody('txtSecurityAnswer', 'Security answer must be entered.').notEmpty();
    let errors = req.validationErrors();

    if (errors) {
        res.render('register', {
            errors: errors,
            User: newUser
        });
    } else {
        delete newUser.password2;
        User.createUser(newUser, function (err, user) {
            if (err) {
                console.log(err);
                res.redirect('/register');
            }
        });
        req.flash('success_msg', 'Registration Successful, Proceed to login..');
        res.redirect('/users/login');
    }
});

//Local Strategy

passport.use(new LocalStrategy(
    function (username, password, done) {
        User.getUserByUsername(username, function (err, user) {
            if (err) throw err;
            if (!user) {
                return done(null, false, { message: 'Unknown User' });
            }

            User.comparePassword(password, user.password, function (err, isMatch) {
                if (err) throw err;
                if (isMatch) {
                    return done(null, user);
                } else {
                    return done(null, false, { message: 'Invalid Password' })
                }
            });
        });
    }));

passport.serializeUser(function (user, done) {
    done(null, user._id.toHexString());
});

passport.deserializeUser(function (id, done) {
    User.getUserById(id, function (err, user) {
        done(err, user);
    });
});


router.post('/login',
    passport.authenticate('local', { successRedirect: '/users/Dashboard', failureRedirect: '/users/login', failureFlash: true })
);

router.get('/logout', function (req, res, next) {
    req.logout();
    req.flash('success_msg', 'You are Logged out');
    if (User["_id"])
        delete User["_id"];
    res.redirect('/');
});

router.get('/Dashboard', common.ensureAuthenticated, function (req, res) {
    if (req && req.user) {
        rating
            .getPreviousRatings(req.user._id)
            .then((result) => {

                let promiseArr = [];
                let ratings = {};
                for (let index = 0; index < result.length; index++) {
                    promiseArr.push(course.getProfessorsById(result[index].professors));
                    ratings[result[index]._id.toHexString()] = {
                        profId: result[index].professors.toHexString(),
                        rating: result[index].ratings,
                        name: ''
                    };
                }
                Promise
                    .all(promiseArr)
                    .then((resultProf) => {

                        let results = [];

                        for (let index = 0; index < Object.keys(ratings).length; index++) {
                            let id = Object.keys(ratings)[index];
                            let inf = ratings[id];
                            let obj = {};
                            for (let index1 = 0; index1 < resultProf.length; index1++) {
                                if (resultProf[index1][0]._id.toHexString() === inf.profId) {
                                    obj.id = id;
                                    obj.rating = inf.rating;
                                    obj.name = resultProf[index1][0].name;
                                    results.push(obj);
                                    break;
                                }
                            }
                        }

                        let userName = req.user.name;

                        res.render('userDashboard', { results: results, name: req.user.name });
                    })
                    .catch((err) => {
                        console.log(err);
                        res.redirect('/');
                    });
            }).
            catch((err) => {
                console.log(err);
                res.redirect('/');
            });

    }
    else
        res.redirect('/users/login');
});

router.get('/forgotPasswordInitial', function (req, res) {
    res.render('forgotPassword');
});

router.post('/VerfiyUser', function (req, res) {
    if (req && req.body) {
        //Validation
        req.checkBody('txtEmailId', 'Email is required..').notEmpty();
        req.checkBody('txtuserId', 'Username is required..').notEmpty();
        req.checkBody('ddnSecQuestion', 'Security question must be selcected.').notEmpty();
        req.checkBody('txtSecAnswer', 'Security answer must be entered.').notEmpty();
        let errors = req.validationErrors();

        if (errors) {
            res.render('forgotPassword', {
                errors: errors
            });
        } else {
            let user = User;
            user.email = req.body.txtEmailId;
            user.username = req.body.txtuserId;
            user.securityQuestion = req.body.ddnSecQuestion;
            user.securityAnswer = req.body.txtSecAnswer;
            User.verifyUser(user)
                .then((result) => {
                    res.render('passwordReset', { userId: result });
                })
                .catch((err) => {
                    res.render('forgotPassword', { error: err });
                });
        }
    }
    else
        res.redirect('/forgotPasswordInitial');
});

router.post('/resetPassword', function (req, res) {
    if (req && req.body) {
        let userId = req.body.hdnUserId;
        req.checkBody('txtPassword', 'New password is required..').notEmpty();
        req.checkBody('txtPassword2', 'Password do not match..').equals(req.body.txtPassword);
        let errors = req.validationErrors();

        if (errors) {
            res.render('passwordReset', {
                errors: errors,
                userId: userId 
            });
        } else {
            let password = req.body.txtPassword;
            User.updatePassword(userId, password)
                .then((result) => {
                    req.flash('success_msg', 'Password successfully reset, please login.');
                    res.redirect('/users/login');
                })
                .catch((err) => {
                    res.render('passwordReset', {
                        error: err,
                        userId: userId
                    });
                });
        }
    }
});

router.post('/checkExistingUsername', function (req, res) {
    if (req && req.body && req.body.serverData) {
        let username = JSON.parse(req.body.serverData);
        User
            .checkExistingUsername(username)
            .then((result) => {
                res.send({ proceed: true, message: '' });
            })
            .catch((err) => {

                res.send({ proceed: false, message: err });
            });
    }
    else {
        res.send({ proceed: false, message: 'Error while checking username' });
    }
});

router.post('/checkExistingEmailId', function (req, res) {
    if (req && req.body && req.body.serverData) {
        let emailId = JSON.parse(req.body.serverData);
        User
            .checkExistingEmailId(emailId)
            .then((result) => {
                res.send({ proceed: true, message: '' });
            })
            .catch((err) => {

                res.send({ proceed: false, message: err });
            });
    }
    else {
        res.send({ proceed: false, message: 'Error while checking username' });
    }
});

router.get('/aboutus', function (req, res) {
    res.render('aboutus');
});

module.exports = router;