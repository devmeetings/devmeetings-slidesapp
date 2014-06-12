var UserModel = require('../models/user');

exports.getOrCreateUser = function(user, callback) {
    UserModel.findOne({
        userId: user.userId
    }).exec().then(function(dbUser) {
        if (dbUser) {
            // User found just pass
            callback(null, dbUser);
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