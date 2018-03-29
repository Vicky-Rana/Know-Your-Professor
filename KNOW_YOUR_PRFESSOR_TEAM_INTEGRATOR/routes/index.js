let express = require('express');
let router = express.Router();
let professors = require('../models/course');
let ratings = require('../models/rating');
// Get Homepage

/*
* Route to get render home page
*/
router.get('/', function (req, res) {
    res.render('home');
});

/*
* Route to get professor by partial name. This will be used in auto complete.
*/
router.post('/SearchProfessorByName', function (req, res) {
    let searchTerm = req.body.serverData;
    professors
        .getProfessorsByName(JSON.parse(searchTerm))
        .then((result) => {
            res.send(result);
        })
        .catch((err) => {
            console.log(err);
            res.send(null);
        });
});

/*
* Route to get professor information. This will return the rating, user comments and all other parameters for all the users.
* There is no filter by user id since this can be called by external user without logging in.
*/
router.post('/getOpenProfessorRatings', function (req, res) {
    if (req && req.body && req.body.serverData) {
        let profId = JSON.parse(req.body.serverData);
        ratings.getProfessorRatingById(profId)
            .then((result) => {

                let sum = result.reduce((acum, currentVal, currentIndex, result) => {
                    return acum + parseInt(currentVal.ratings);
                }, 0);
                
                let average = sum / result.length;

                let rtnObject = {
                    averageRatings: average,
                    commentsByUser: result
                };
                res.send(rtnObject);
            })
            .catch((err) => {
                console.log(err);
                res.send(null);
            });
    }
    else
        res.send(null);

});

module.exports = router;