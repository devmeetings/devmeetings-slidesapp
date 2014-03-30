var DeckModel = require('../models/deck');

exports.list = function (req, res) {
    DeckModel.find(function (err, decks) {
        if (err) {
            console.error(err);
            res.send([]);
            return;
        }
        res.send(decks);
    });
};

exports.create = function (req, res) {
    var d = new DeckModel(req.body);
    d.save(function (err, deck) {
        if (err) {
            console.error(err);
            res.send(500, err);
            return;
        }
        res.send(deck);
    });
};

exports.delete = function (req, res) {
    DeckModel.findByIdAndRemove(req.params.id, function (err, deck) {
        if (err) {
            res.send(404, err);
            return;
        }
        res.send(200);
    });
};

exports.getOneRequireJs = function (req, res) {
    DeckModel.findById(req.params.id, function (err, deck) {
        if (err) {
            res.send(404, err);
            return;
        }
        res.send("define(" + JSON.stringify(deck) + ");");
    });
};