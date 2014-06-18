var UserModel = require('../models/user');
var _ = require('lodash');

exports.upsertUser = function(user, callback) {
    UserModel.findOne({
        userId: user.userId
    }).exec().then(function(dbUser) {
        if (dbUser) {
            // Update user
            _.extend(dbUser, user);
            dbUser.save(callback);
            return;
        }

        // It's not in DB. We have to insert that
        UserModel.create(user, function(err, dbUser) {
            if (err) {
                callback(err);
                return;
            }

            callback(null, dbUser);
        });
    });
};

exports.findByUserId = function(userId, callback) {
    UserModel.findOne({
        userId: userId
    }).exec(callback);
};