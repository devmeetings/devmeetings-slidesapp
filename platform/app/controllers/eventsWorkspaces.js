var _ = require('lodash'),
    Q = require('q'),
    Slidesaves = require('../models/slidesave'),
    Workspaces = require('../models/workspace');

var onError = function(res) {
    return function(err) {
        console.error(err);
        res.send(400);
    };
};

var onDone = function() {};

var EventsWorkspaces = {

    get: function(req, res) {
        var baseSlide = req.params.baseSlide;

        Q.ninvoke(Slidesaves.find({
            baseSlide: baseSlide,
            $or: [{
                title: "default workspace"
            }, {
                title: {
                    $exists: false
                }
            }]
        }).populate('user').lean(), 'exec').then(function(saves) {
            res.send(saves);
        }).fail(onError(res)).done(onDone);
    },

    getPages: function(req, res) {
        var userId = req.params.userId;

        Q.ninvoke(Workspaces.find({
            authorId: userId
        }).sort({
            _id: -1
        }).limit(50).lean(), 'exec').then(function(saves) {
            res.send(saves);
        }).fail(onError(res)).done(onDone);
    }

};

module.exports = EventsWorkspaces;