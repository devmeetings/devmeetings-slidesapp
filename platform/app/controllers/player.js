var PlayerSave = require('../models/player-save');
var Participants = require('../services/participants');

var Player = {
    userSaves: function(req, res) {
        var userId = req.params.id;        
        PlayerSave.find({userId: userId}, function (err, playerSaves) {
            if (err) {
                console.error(err);
                res.send(404, err);
                return;
            }
            res.send(playerSaves);
        });
    },
    save: function (req, res) {
        PlayerSave.create(req.body, function (err) {
            if (err) {
                console.error(err);
                res.send(404, err);
                return;
            }
            res.send(200);
        });
    }
};

module.exports = Player;