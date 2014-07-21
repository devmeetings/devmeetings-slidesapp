var Training = require('../models/training');

var TrainingCtrl = {
    create: function (req, res) {
        Training.create(req.body, function (err) {
            if (err) {
                console.error(err);
                res.send(400);
                return;
            }
            res.send(200);
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
    }
};

module.exports = TrainingCtrl;
