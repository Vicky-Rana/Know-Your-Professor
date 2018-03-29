let express = require('express');
let router = express.Router();
let common = require('./common');
let termCollection = require('../models/termCollection');
let ratings = require('../models/rating');
let ObjectId = require('mongodb').ObjectID;
let course = require('../models/course');

router.post('/viewRatings', function (req, res) {
    res.render('showProfRatings');
});


router.get('/rating', common.ensureAuthenticated, function (req, res) {

    if (req && req.session && req.session['profId']) {
        let id = new ObjectId(req.session['profId']);
        delete req.session['profId'];
        Promise
            .all([termCollection.getYears(), ratings.getRatingsById(id)])
            .then((results) => {
                res.render('ratings', { years: results[0], ratings: encodeURIComponent(JSON.stringify(results[1][0])) });
            })
            .catch((err) => {
                console.log(err);
                res.send(null);
            });
    }
    else {
        termCollection.getYears()
            .then((years) => {
                res.render('ratings', { years: years });
            })
            .catch((err) => {
                console.log(err);
                res.send(null);
            });
    }
});

router.post('/saveratings', common.ensureAuthenticated, function (req, res) {
    if (req && req.body) {
        let year = req.body.ddnYear;
        let term = req.body.ddnTerm;
        let department = req.body.ddnDepartment;
        let courses = req.body.ddnCourses;
        let professors = req.body.ddnProfessors;
        let rating = req.body.ddnRatings;
        let takeAgain = req.body.takeAgain;
        let grading = req.body.grading;
        let assignments = req.body.assignments;
        let comments = req.body.txtComments;
        let id = req.body.hdnRowId;

        let ratingObj = ratings.ratings;
        ratingObj.year = year;
        ratingObj.term = term;
        ratingObj.department = new ObjectId(department);
        ratingObj.courses = new ObjectId(courses);
        ratingObj.professors = new ObjectId(professors);
        ratingObj.ratings = rating;
        ratingObj.takeAgain = takeAgain;
        ratingObj.grading = grading;
        ratingObj.assignments = assignments;
        ratingObj.comments = comments;
        ratingObj.userid = req.user._id;
        if (id && id !== '')
            ratingObj["_id"] = new ObjectId(id);
        else
            delete ratingObj['_id'];
        ratings
            .saveRatings(ratingObj)
            .then(() => {
                if (!ratingObj.id)
                    course.updateProfessorRating(ratingObj.professors);
                req.flash('success_msg', 'Rating saved successfully...');
                res.redirect('/users/Dashboard');
            })
            .catch((err) => {
                console.log(err);
                res.redirect('/rating');
            });
    }
    else
        res.render('ratings');
});

router.get('/getRatingInfo/:profId', function (req, res) {
    req.session['profId'] = req.params.profId;
    res.redirect('/ratings/rating/');
});

module.exports = router;