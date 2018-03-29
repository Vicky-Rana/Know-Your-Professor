let express = require('express');
let router = express.Router();
let common = require('./common');
let termCollection = require('../models/termCollection');

router.post('/termsbyyear', common.ensureAuthenticated, function (req, res) {
    if (req && req.body && req.body.serverData) {
        let year = JSON.parse(req.body.serverData);

        if (year) {
            let nYear = parseInt(year);
            termCollection
                .getTermsByYear(nYear)
                .then((terms) => {
                    res.send(terms);
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

router.post('/getDepartments', common.ensureAuthenticated, function (req, res) {
    if (req && req.body && req.body.serverData) {
        let data = JSON.parse(req.body.serverData);

        if (data) {
            let nYear = parseInt(data.year);
            let strTerm = data.term;

            termCollection
                .getDepartments(nYear, strTerm)
                .then((departments) => {
                    res.send(departments);
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