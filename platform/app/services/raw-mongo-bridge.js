var Q = require('q'),
    MongoClient = require('mongodb').MongoClient;


var MongoBridge = function(dbpath) {
    var result = Q.defer();
    MongoClient.connect(dbpath, function(err, db) {
        if (err) {
            throw err;
        }

        result.resolve({
            getSnapshots: function(startTime, endTime) {
                var snaps = Q.defer();
                db.collection('snapshots').find({
                    timestamp: {
                        $gt: startTime || 0,
                        $lt: endTime || Date.now()
                    }
                }).sort({
                    timestamp: 1
                }).toArray(function(err, snapshots) {
                    if (err) {
                        throw err;
                    }
                    snaps.resolve(snapshots);
                });
                return snaps.promise;
            },
            saveRecordings: function(recordings) {
                var recs = Q.defer();
                db.collection('recordings').insert(recordings, function(err, inserted) {
                    if (err) {
                        throw err;
                    }
                    recs.resolve(inserted);
                });
                return recs.promise;
            },
            getRawRecordings: function(group) {
                return Q.ninvoke(db.collection('raw_recordings').find({
                    'meta.group': group
                }).sort({
                    timestamp: 1
                }), 'toArray');
            },
            getRawRecordingsGroups: function() {
                return Q.ninvoke(db.collection('raw_recordings'), 'distinct', 'meta.group');
            },
            saveRawRecordings: function(recordings) {
                return Q.ninvoke(db.collection('raw_recordings'), 'insert', recordings);
            }
        });
    });

    return result.promise;
};


module.exports = MongoBridge;