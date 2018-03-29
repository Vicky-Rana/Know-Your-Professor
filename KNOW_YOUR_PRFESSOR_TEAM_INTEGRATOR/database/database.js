let MongoDbClient = require('mongodb').MongoClient;
let url = 'mongodb://localhost/loginapp';
let state = {
    db: null
};

/*
* Function to connect to database. If the db instance is not present then new connection is created
* else the existing connection will be used.
*/
exports.connect = function (next) {
    if (state.db)
        return next();
    MongoDbClient.connect(url, function (err, db) {
        if (err)
            return next(err);
        state.db = db;
        next();
    });
}

/*
* Function to get records from the database. If fields are not mentioned then all the fields will be extracted
*/
exports.find = function (collectionName, query, fields, next) {
    let self = this;
    let collection = state.db.collection(collectionName);

    collection
        .find(query, fields)
        .toArray(function (err, results) {

            if (err)
                console.log(err);
            //self.close();
            next(err, results);
        });
}

/*
* Function to get only one record from the database
*/
exports.findOne = function (collectionName, query, next) {
    let self = this;
    let collection = state.db.collection(collectionName);

    collection
        .findOne(query)
        .then((results) => {
            //self.close();
            next(null, results);
        })
        .catch((err) => {
            next(err, null)
        });
}

/*
* Function to close the database connection
*/
exports.close = function () {
    state.db.close(function (err) {
        if (err)
            console.log(err);
        else
            state.db = null;
    });
}

/*
* Function to insert record in the database.
* If "_id" for the record is mentioned, then record will be updated else new record will be created.
*/
exports.insert = function (collectionName, query, next) {
    let self = this;
    let collection = state.db.collection(collectionName);
    collection
        .save(query)
        .then((result) => {
            //self.close();
            next(null);
        })
        .catch((err) => {
            next(err);
        });
}

/*
* Function to get the distinct values for the column mentioned in the "key"
* filter will be applied based on query else all the records will be searched
*/
exports.distinct = function (collectionName, key, query, next) {
    let self = this;
    let collection = state.db.collection(collectionName);
    collection
        .distinct(key, query)
        .then((result) => {
            //self.close();
            next(null, result);
        })
        .catch((err) => {
            next(err, null);
        });
}

/*
* Function to update only one record. "fields" must be set or record in the database will be messed.
*/
exports.updateOne = function (collectionName, query, fields, next) {
    let self = this;
    let collection = state.db.collection(collectionName);
    collection
        .findOneAndUpdate(query, fields)
        .then((result) => {
            next(null, result);
        })
        .catch((err) => {
            next(err, null);
        });        
}

/*
* Function to update only one record. "fields" must be set or record in the database will be messed.
*/
exports.updateOneField = function (collectionName, query, fields, next) {
    let self = this;
    let collection = state.db.collection(collectionName);
    collection
        .findOneAndUpdate(query, fields)
        .then((result) => {
            next(null, result);
        })
        .catch((err) => {
            next(err, null);
        });
}