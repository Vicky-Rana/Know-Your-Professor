let database = require('../database/database');
let ObjectId = require('mongodb').ObjectID;

/*
* ORM representation of ratings table.
*/
let ratings = {
    "_id": null,
    userid: '',
    year: 0,
    term: '',
    department: '',
    courses: '',
    professors: '',
    ratings: '',
    takeAgain: '',
    grading: '',
    assignments: '',
    comments: ''
};

module.exports.ratings = ratings;

let collectionName = 'ratings';

/*
* Function to save ratings
*/
module.exports.saveRatings = function (ratings) {
    return new Promise((resolve, reject) => {
        database.connect(function (err) {
            if (err)
                reject((err));
            else
                database.insert(collectionName, ratings, function (err) {
                    if (err)
                        reject(err);
                    else
                        resolve();
                });
        });
    });
}

/*
* Function to get all the previous ratings by a user. This will be called while loading Dashboard
*/
module.exports.getPreviousRatings = function (userid) {
    return new Promise((resolve, reject) => {
        let query = { userid: userid };
        let fields = {
            "ratings": true,
            "professors": true
        };

        database.connect(function (err) {
            if (err)
                reject(err);
            else {
                database.find(collectionName, query, fields, function (err, results) {
                    if (err)
                        reject(err);
                    else
                        database.find(collectionName, query, fields, function (err, results) {
                            if (err)
                                reject(err);
                            else
                                resolve(results);
                        });
                });
            }
        })
    });
}

/*
* Function to get rating information by id. This will be called while editing the ratings form.
*/
module.exports.getRatingsById = function (id) {
    return new Promise((resolve, reject) => {
        let query = { "_id": id };
        database.connect(function (err) {
            if (err)
                reject(err);
            else {
                database.find(collectionName, query, {}, function (err, results) {
                    if (err)
                        reject(err);
                    else
                        resolve(results);
                });
            }
        });
    });
}

module.exports.getProfessorRatingById = function (professorId) {
    return new Promise((resolve, reject) => {
        let query = { "professors": new ObjectId(professorId) };
        let fields = { "ratings": true, "takeAgain": true, "grading": true, "assignments": true,"comments": true };
        database.connect(function (err) {
            if (err)
                reject(err);
            else
                database.find(collectionName, query, fields, function (err, results) {
                    if (err)
                        reject(err);
                    else
                        resolve(results);
                });
        })
    });
}