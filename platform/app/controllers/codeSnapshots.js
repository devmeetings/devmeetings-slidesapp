var CodeSnapshotModel = require('../models/codeSnapshot');

exports.list = function (req, res) {
    CodeSnapshotModel.find(function (err, codeSnapshot) {
        if (err) {
            console.error(err);
            res.send([]);
            return;
        }
        res.send(codeSnapshot);
    });
};

exports.listForUser = function (req, res) {
    CodeSnapshotModel.find({ userName: req.params.userId }, function (err, codeSnapshot) {
        if (err) {
            console.error(err);
            res.send([]);
            return;
        }
        res.send(codeSnapshot);
    });
};

exports.update = function (req, res) {
    // TODO: userId to be added

    var conditions = {
        userName: req.user.name,
        slideId: req.body.codeSnapshot.slide
    };
    var update = {
        $addToSet: {
            snapshots: {
                code: req.body.codeSnapshot.code,
                timestamp: + new Date()
            }
        }
    };
    var options = {
        upsert: true
    };

    CodeSnapshotModel.update(conditions, update, options, function(err, codeSnapshot) {
        // console.log('updated in db');
    });

};