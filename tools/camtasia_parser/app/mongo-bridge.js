var Q = require('q'),
    MongoClient = require('mongodb').MongoClient;


var MongoBridge = function (dbpath) {
    var result = Q.defer();
    MongoClient.connect(dbpath, function (err, db) {
        if (err) {
            throw err;
        }

        result.resolve({
            getSnapshots: function () {
                var snaps = Q.defer();
                db.collection('snapshots').find().sort( {timestamp: 1}).toArray( function (err, snapshots) {
                    if (err) {
                        throw err;
                    }
                    snaps.resolve(snapshots);
                });
                return snaps.promise;
            }, 
            saveRecordings: function (recordings) {
                var recs = Q.defer();
                db.collection('recordings').insert(recordings, function (err, inserted) {
                    if (err) {
                        throw err;
                    }
                    recs.resolve(inserted);
                });
                return recs.promise;
            }
        });
    });

    return result.promise;
};


module.exports = MongoBridge;

