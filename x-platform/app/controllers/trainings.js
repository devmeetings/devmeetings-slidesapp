var Training = require('../models/training');

var TrainingCtrl = {
    list: function (req, res) {
        Training.find({}, function (err, trainings) {
            if (err) {
                console.error(err);
                res.send(400);
                return;
            }
            res.send(trainings);
        });
    },
    get: function (req, res) {
        Training.findById(req.params.id, function (err, training) {
            if (err) {
                console.error(err);
                res.send(400);
                return;
            }
            res.send(training);
        });
    },
    create: function (req, res) {
        Training.create(req.body, function (err, training) {
            if (err) {
                console.error(err);
                res.send(400);
                return;
            }
            res.send(training);
        });
    },
    edit: function (req, res) {
        delete req.body._id;
        Training.findByIdAndUpdate(req.params.id, req.body, {
            upsert: true
        }, function (err, training) {
            if (err) {
                console.error(err);
                res.send(400);
                return;
            }
            res.send(200);
        });
    },
    delete: function (req, res) {
    }
};

module.exports = TrainingCtrl;
