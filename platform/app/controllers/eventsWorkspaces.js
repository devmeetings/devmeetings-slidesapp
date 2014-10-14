var _ = require('lodash'),
    Q = require('q'),
    mongoose = require('mongoose'),
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
    },

    getTimeline: function(req, res) {
        var userId = req.params.userId;

        Q.ninvoke(Workspaces.find({
            authorId: userId
        }, {
            hash: 1,
            lastAccessTime: 1,
            files: 1
        }).sort({
            _id: -1
        }).lean(), 'exec').then(function(workspaces) {
            var ws = workspaces.map(function(workspace) {
                workspace.createTime = new mongoose.Types.ObjectId(workspace._id).getTimestamp();

                var fileNames = Object.keys(workspace.files);
                workspace.files = fileNames.reduce(function(memo, key) {
                    var val = workspace.files[key];
                    var keys = key.split('|');
                    var type = keys[keys.length - 1];

                    memo[type] = memo[type] || 0;
                    memo[type] += val.length;
                    return memo;
                }, {});

                workspace.fileNames = fileNames;
                return workspace;
            });
            res.send(ws);
        }).fail(onError(res)).done(onDone);
    }

};

module.exports = EventsWorkspaces;