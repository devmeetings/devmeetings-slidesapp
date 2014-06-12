var passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    GoogleStrategy = require('passport-google').Strategy,
    FacebookStrategy = require('passport-facebook').Strategy,
    users = require('../users.json'),
    config = require('./config'),
    UserModel = require('../app/models/user');

var msg = function(message) {
    return {
        message: message
    };
};


var getOrCreate = function(user, callback) {
    UserModel.findOne({
        userId: user.userId
    }).exec().then(function(dbUser) {
        if (dbUser) {
            // User found just pass
            callback(null, dbUser);
            return;
        }

        // It's not in DB. We have to insert that
        UserModel.create(user, function(err) {
            if (err) {
                callback(err);
                return;
            }

            callback(null, user);
        });
    });
};

passport.use(new LocalStrategy(function(username, password, done) {
    var user = users[username];
    if (!user) {
        done(null, false, msg("Cannot find user " + username));
        return;
    }
    if (user.password !== password) {
        done(null, false, msg("Incorrect password."));
        return;
    }

    getOrCreate(user, done);
}));

passport.use(new GoogleStrategy({
    returnURL: config.realmUrl + "/auth/google/return",
    realm: config.realmUrl
}, function(identifier, profile, done) {

    var user = {
        userId: identifier,
        name: profile.displayName
    };

    getOrCreate(user, done);
}));

passport.use(new FacebookStrategy({
    // We can only use facebook on production
    clientID: config.fb.id,
    clientSecret: config.fb.secret,
    callbackURL: config.realmUrl + "/auth/facebook/callback"
}, function(accessToken, refreshToken, profile, done) {

    var user = {
        userId: profile.id,
        name: profile.name
    };

    getOrCreate(user, done);
}));


passport.serializeUser(function(user, done) {
    done(null, user.userId);
});

passport.deserializeUser(function(username, done) {
    UserModel.findOne({
        userId: username
    }).exec(done);
});