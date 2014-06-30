var RecordingModel = require('../models/recording');

var Recordings = {
    list: function (req, res) {
        RecordingModel.find( function (err, recordings) {
            if (err) {
                console.error(err);
                res.send(404, err);
                return;
            }
            res.send(recordings);
        });
    },
    get: function (req, res) {
        RecordingModel.find( {
            slideId: req.params.id
        }, function (err, recordings) {
            if (err) {
                console.error(err);
                res.send(404, err);
                return;
            }
            res.send(recordings);
        });
    }
};


module.exports = Recordings;
