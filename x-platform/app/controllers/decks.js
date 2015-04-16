var DeckModel = require('../models/deck');
var _ = require('lodash');

exports.list = function(req, res) {
    DeckModel.find(function(err, decks) {
        if (err) {
            console.error(err);
            res.send(400, err);
            return;
        }
        res.send(decks);
    });
};

exports.get = function(req, res) {
    DeckModel.findById(req.params.id, function(err, data) {
        if (err) {
            console.error(err);
            res.send(400, err);
            return;
        }
        res.send(data);
    });
};

exports.create = function(req, res) {
    DeckModel.create(req.body, function (err){
        if (err){
            console.error(err);
            res.send(400, err);
            return;
        }   
        var decks = Array.prototype.slice.call(arguments, 1);
        res.send(_.pluck(decks, "_id"));
    });
};

exports.delete = function(req, res) {
    DeckModel.findByIdAndRemove(req.params.id, function(err, deck) {
        if (err) {
            res.send(400, err);
            return;
        }
        res.sendStatus(200);
    });
};

exports.edit = function(req, res) {
    // Cannot specify _id
    delete req.body._id;
    delete req.body.__v;

    DeckModel.findByIdAndUpdate(req.params.id, req.body, {
        upsert: true
    }, function(err, deck) {
        if (err) {
            console.error(err);
            res.send(400, err);
            return;
        }
        res.sendStatus(200);
    });
};

