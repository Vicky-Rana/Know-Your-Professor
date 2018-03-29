let database = require('../database/database');
let collectionName = 'termcollections';

/*
* Function to get distinct years from the termcollection table. This will be used in ratings form
*/
module.exports.getYears = function () {
    return new Promise((resolve, reject) => {
        database.connect(function (err) {
            if (err)
                reject(err);
            else {
                database.distinct(collectionName, 'year', {}, function (err, results) {
                    if (err)
                        reject(err);
                    else
                        resolve(results);
                });
            }
        });
    });
}

/*
* Function to get terms based on year from the termocllection table. This will be used in the ratings form
*/
module.exports.getTermsByYear = function (year) {
    return new Promise((resolve, reject) => {
        let query = { year: year };
        database.connect(function (err) {
            if (err)
                reject(err);
            else {
                database.distinct(collectionName, 'term', query, function (err, results) {
                    if (err)
                        reject(err);
                    else
                        resolve(results);
                });
            }
        });
    });
}

/*
* Function to get departments by selected year and term from the term collection table.
*/
module.exports.getDepartments = function (year, term) {
    return new Promise((resolve, reject) => {
        let query = { year: year, term: term };
        database.connect(function (err) {

            if (err)
                reject(err);
            else {
                let fields = { "dept": true };
                database.find(collectionName, query, fields, function (err, results) {
                    if (err)
                        reject(err);
                    else
                        resolve(results);
                });
            }
        });
    });
}