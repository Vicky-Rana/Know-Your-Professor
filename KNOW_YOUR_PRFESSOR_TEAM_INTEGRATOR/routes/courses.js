let express = require('express');
let router = express.Router();
let common = require('./common');
let courses = require('../models/course');

/*
* Route to get courses by departments
*/
router.post('/getCourses', common.ensureAuthenticated, function (req, res) {
    if (req && req.body && req.body.serverData) {
        let data = JSON.parse(req.body.serverData);

        if (data) {

            courses
                .getCourses(data)
                .then((courses) => {
                    res.send(courses);
                })
                .catch((err) => {
                    console.log(err);
                    res.send(null);
                });
        }
        else
            res.send(null);
    }
    else
        res.send(null);
});

/*
* Route to get professors based on course id
*/
router.post('/getProfessors', common.ensureAuthenticated, function (req, res) {
    if (req && req.body && req.body.serverData) {
        let data = JSON.parse(req.body.serverData);

        if (data) {

            courses
                .getProfessors(data)
                .then((professors) => {
                    res.send(professors);
                })
                .catch((err) => {
                    console.log(err);
                    res.send(null);
                });
        }
        else
            res.send(null);
    }
    else
        res.send(null);
});
module.exports = router;