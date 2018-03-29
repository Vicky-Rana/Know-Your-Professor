let ObjectId = require('mongodb').ObjectID;
let database = require('../database/database');
let collectionName = 'courses';
let collectionProfessor = 'professors';

/*
* Function to get courses by departments
*/
module.exports.getCourses = function (departmentId) {
    return new Promise((resolve, reject) => {
        departmentId = new ObjectId(departmentId);
        let query = { "terms": { $in: [departmentId] } };
        database.connect(function (err) {
            if (err)
                reject(err);
            else {
                let fields = { "name": true, "value": true };
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

/*
* Function to get professors by courses
*/
module.exports.getProfessors = function (courseId) {
    return new Promise((resolve, reject) => {
        courseId = new ObjectId(courseId);
        let query = { "courses": { $in: [courseId] } };
        database.connect(function (err) {
            if (err)
                reject(err);
            else {
                let fields = { "name": true };
                database.find(collectionProfessor, query, fields, function (err, results) {
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
* Function to get professor information by partial name. This will be called in autocomplete functionality
*/
module.exports.getProfessorsByName = function (name) {
    return new Promise((resolve, reject) => {

        let query = { "name": new RegExp(name, 'i') };
        database.connect(function (err) {
            if (err)
                reject(err);
            else {
                let fields = { "name": true };
                database.find(collectionProfessor, query, fields, function (err, results) {

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
* Function to update total rated by count of the professor
*/
module.exports.updateProfessorRating = function (professorId) {
    return new Promise((resolve, reject) => {
        let query = { "_id": professorId };
        let fields = { $inc: { totalRatedbyCount: 1 } };
        database.connect(function (err) {
            if (err)
                reject(err);
            else {
                database.updateOne(collectionProfessor, query, fields, function (err, results) {
                    if (err)
                        reject(err);
                    else
                        resolve();
                });
            }
        });
    });
}

/*
* Function to get professor name by professor id. This will be used in autocomplete functionality
*/
module.exports.getProfessorsById = function (professorId) {
    return new Promise((resolve, reject) => {
        let query = { "_id": professorId };
        let fields = { "name": true };
        database.connect(function (err) {
            if (err)
                reject(err);
            else
                database.find(collectionProfessor, query, fields, function (err, results) {
                    if (err)
                        reject(err);
                    else
                        resolve(results);
                });
        });
    });
}

/*
* Function to get total rated by counts based on professorid.
*/
module.exports.getProfessorRatingById = function (professorId) {
    return new Promise((resolve, reject) => {
        let query = { "_id": new ObjectId(professorId) };
        let fields = { "totalRatedbyCount": true };
        database.connect(function (err) {
            if (err)
                reject(err);
            else
                database.find(collectionProfessor, query, fields, function (err, results) {
                    if (err)
                        reject(err);
                    else
                        resolve(results);
                });
        });
    });
}