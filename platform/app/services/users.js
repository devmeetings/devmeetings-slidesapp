var UserModel = require('../models/user'),
    SALT_WORK_FACTOR = 10,
    authFields = {
        usernameField: 'email',
        passwordField: 'password'
    };

/**
 * Check hash
 * @constructor
 * @param {String} candidatePassword
 * @param {String} hash
 * @param {*} callback
 */
var comparePassword = function(candidatePassword, hash, callback) {
    var bcrypt = require('bcrypt');
    bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
        return err ? callback(err) : callback(null, isMatch);
    });
};

/**
 * Extend User model schema to automatically hash password before 'save'
 */
UserModel.schema.pre('save', function(next) {
    var user = this;

    if (!user.isModified('password') || !user.password) {
        return next();
    }

    var bcrypt = require('bcrypt');
    // generate a salt
    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
        if (err) {
            return next(err);
        }

        bcrypt.hash(user.password, salt, function(err, hash) {
            if (err) {
                return next(err);
            }
            user.password = hash;
            return next();
        });
    });
});

/**
 * Authorization fields for Passport
 * @type {{usernameField: string, passwordField: string}}
 */
exports.authFields = authFields;

/**
 * Find User by _id field
 * @constructor
 * @param {String} id
 * @param {Object} collback
 */
exports.findByUserId = function(id, collback) {
    UserModel.findById(id).exec(collback);
};

/**
 * Finds user or create it
 * @constructor
 * @param {Object} user
 * @param {Object} callback
 */
exports.findOrCreate = function(user, callback) {
    UserModel.findOne({
        email: user.email
    }).exec().then(function(dbUser) {
        if (dbUser) {
            return callback(null, dbUser);
        }
        var newUser = new UserModel(user);
        newUser.save(function(err) {
            return err ? callback(err) : callback(null, newUser);
        });
    });
};

/**
 * Verify user password
 * @constructor
 * @param {String} email
 * @param {String} password
 * @param {Object} done
 */
exports.verify = function(email, password, done) {
    UserModel.findOne({
        email: email,
        type: 'local'
    }, function(err, user) {
        if (err) {
            throw err;
        }

        if (user === null) {
            return done(null, false, {
                message: "Cannot find user " + email
            });
        }

        comparePassword(password, user.password, function(err, isMatch) {
            if (err) {
                throw err;
            }
            return !isMatch ? done(null, false, {
                message: "Cannot find user " + email
            }) : done(null, user);
        });
    });
};

exports.findLocalUserByEmail = function(email, done) {
    UserModel.findOne({
        email: email,
        type: 'local'
    }, done);
};