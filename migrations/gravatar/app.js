'use strict';

if (process.argv.length !== 3) {
    console.error('you must set database name');
    process.exit(-1);
}

var MongoClient = require('mongodb').MongoClient,
    gravatar = require('gravatar'),
    Q = require('q');

var mongoHost = process.env.MONGO_HOST || 'localhost';
var MONGO_URL = 'mongodb://' + mongoHost + '/' + process.argv[2];
console.log('migrating on ' + process.argv[2]);

var connectToMongo = function () {
    var result = Q.defer();
    MongoClient.connect(MONGO_URL, function (err, db) {
        if (err) {
            throw err;
        }
        result.resolve(db);
    });
    return result.promise;
};

var db;

connectToMongo().then(function (mongoDb) {
    db = mongoDb;
    var usersPromise = Q.defer();
    db.collection('users').find({}).toArray( function (err, users) {
        usersPromise.resolve(users);
    });
    return usersPromise.promise;
}).then(function (users) {
    users.forEach(function (user) {
        db.collection('events').update({
            'peopleStarted.userId' : user._id
        }, {
            $set: {
                'peopleStarted.$.avatar': gravatar.url(user.email)
            },
            $unset: {
                'peopleStarted.$.mail': ''
            }
        }, {
            multi: true
        }, function (err, event) {
            if (err) {
                throw err;
            }
        });

        db.collection('events').update({
            'peopleFinished.userId' : user._id
        }, {
            $set: {
                'peopleFinished.$.avatar': gravatar.url(user.email)
            },
            $unset: {
                'peopleFinished.$.mail': ''
            }
        }, {
            multi: true
        }, function (err, event) {
            if (err) {
                throw err;
            }
        });

        db.collection('activities').update({
            'owner.userId' : user._id
        }, {
            $set: {
                'owner.avatar' : gravatar.url(user.email)
            },
            $unset: {
                'owner.mail' : ''
            }
        }, {
            multi: true
        }, function (err, activity) {
            if (err) {
                throw err;
            }
        });

        db.collection('observes').update({
            'observed.userId' : user._id
        }, {
            $set: {
                'observed.$.avatar' : gravatar.url(user.email)
            },
            $unset: {
                'observed.$.mail' : ''
            }
        }, {
            multi: true
        }, function (err, obseve) {
            if (err) {
                throw err;
            }
        });

        db.collection('users').update({
            '_id': user._id
        }, {
            $set: {
                'avatar': gravatar.url(user.email)
            }
        }, {
            multi: true
        }, function (err, user) {
            if (err) {
                throw err;
            }
        });

    });
}).done(function () {
    console.log('done');
    process.exit();
});

