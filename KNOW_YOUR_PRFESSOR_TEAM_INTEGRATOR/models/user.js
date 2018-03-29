let database = require('../database/database');
let bcrypt = require('bcryptjs');
let ObjectId = require('mongodb').ObjectID;

/*
* ORM representation of users table.
*/
let User = {
    username: '',
    password: '',
    email: '',
    name: '',
    securityQuestion: '',
    securityAnswer: ''
};

let collectionName = 'users';

module.exports = User;

/*
* Function to get create user. Password will be hashed
*/
module.exports.createUser = function (newUser, callback) {
    bcrypt.genSalt(10, function (err, salt) {
        bcrypt.hash(newUser.password, salt, function (err, hash) {
            // Store hash in your password DB. 
            newUser.password = hash;
            database.connect(function (err) {

                database.insert(collectionName, newUser, function (err) {
                    callback(err);
                });
            });
        });
    });
}

/*
* Function to get unique user by username
*/
module.exports.getUserByUsername = function (username, callback) {
    let query = { username: username };
    database.connect(function (err) {
        if (!err) {
            database.findOne(collectionName, query, function (err, user) {
                callback(null, user);
            });
        }
        else
            callback(err, null);
    });

}

/*
* Function to get user by id
*/
module.exports.getUserById = function (id, callback) {
    let query = { '_id': new ObjectId(id) };
    database.connect(function (err) {
        if (!err) {
            database.findOne(collectionName, query, function (err, user) {
                callback(null, user);
            });
        }
        else
            callback(err, null);
    });
}

/*
* Function to get compare passwords for login after hashing
*/
module.exports.comparePassword = function (candidatePassword, hash, callback) {
    bcrypt.compare(candidatePassword, hash, function (err, isMatch) {
        if (err) throw err;
        callback(null, isMatch);
    });
}

/*
* Function to verify user for password reset. Since the username and email are unique by design only one user should be returned by the query.
*/
module.exports.verifyUser = function (user) {
    return new Promise((resolve, reject) => {
        let query = { username: user.username, email: user.email, securityQuestion: user.securityQuestion, securityAnswer: user.securityAnswer };
        database.connect(function (err) {
            if (err)
                reject(err);
            else {
                database.findOne(collectionName, query, function (err, user) {
                    if (err)
                        reject(err);
                    else
                        if (user)
                            resolve(user._id.toHexString());
                        else
                            reject('User information did not match');
                });
            }
        });
    });
}

/*
* Function to get update the password in password reset
*/
module.exports.updatePassword = function (userid, password) {
    return new Promise((resolve, reject) => {
        bcrypt.genSalt(10, function (err, salt) {
            bcrypt.hash(password, salt, function (err, hash) {
                let query = { "_id": new ObjectId(userid) };
                let fields = { $set: { password: hash } };
                database.connect(function (err) {
                    if (err)
                        reject(err);
                    else
                        database.updateOneField(collectionName, query, fields, function (err, result) {
                            if (err)
                                reject(err);
                            else
                                resolve(result);
                        });
                });
            });
        });
    });
}

/*
* Function to get check usernames for uniqueness
*/
module.exports.checkExistingUsername = function (username) {
    return new Promise((resolve, reject) => {
        let query = { "username": username };
        database.connect(function (err) {
            if (err)
                reject(err);
            else
                database.findOne(collectionName, query, function (err, result) {
                    if (err) {
                        console.error(err);
                        reject('Error while checking username');
                    }
                    else if (result)
                        reject('Username already exists');
                    else
                        resolve();
                });
        });
    });
}

/*
* Function to check email id for uniqueness
*/
module.exports.checkExistingEmailId = function (emailId) {
    return new Promise((resolve, reject) => {
        let query = { "email": emailId };
        database.connect(function (err) {
            if (err)
                reject(err);
            else
                database.findOne(collectionName, query, function (err, result) {
                    if (err) {
                        console.error(err);
                        reject('Error while checking emailId');
                    }
                    else if (result)
                        reject('emailId already exists');
                    else
                        resolve();
                });
        });
    });
}