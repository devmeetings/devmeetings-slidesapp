var Event = require('../models/event'),
    User = require('../models/user'),
    Activity = require('../models/activity'),
    _ = require('lodash'),
    Q = require('q');
    

var onError = function (res) {
    return function (err) {
        console.error(err);
        res.send(400);
    };
};

var onDone = function () {
};

var Events = {
    all: function (req, res) {
        Q.ninvoke(Event.find({}).select('title description image order visible').lean(), 'exec').then(function (events) {
            res.send(events); 
        }).fail(onError(res)).done(onDone);
    },

    get: function (req, res) {
        var id = req.params.id;
        
        Q.ninvoke(Event.findOne({
            _id: id
        }).populate('trainingId').lean(), 'exec').then(function (event) {
            res.send(event);
        }).fail(onError(res)).done(onDone);
    },
    
    addEventSnippet: function (req, res) {
        var event = req.params.event;

        Q.ninvoke(Event.findOneAndUpdate({
            _id: event
        },{
            $push: {
                snippets: req.body 
            }
        }).lean(), 'exec').then(function (event) {
            res.send(200, event.snippets[event.snippets.length - 1]);
        }).fail(onError(res)).done(onDone);
    }, 
    editEventSnippet: function (req, res) {
        var event = req.params.event;
        var snippet = req.params.snippet;
        Q.ninvoke(Event.findOneAndUpdate({
            _id: event,
            'snippets._id': snippet
        },{
            $set: {
                'snippets.$.title': req.body.title,
                'snippets.$.timestamp': req.body.timestamp,
                'snippets.$.markdown': req.body.markdown
            }
        }).lean(), 'exec').then(function (event) {
            res.send(200);
        }).fail(onError(res)).done(onDone);
    },
    deleteEventSnippet: function (req, res) {
        var event = req.params.event;
        var snippet = req.params.snippet;
        Q.ninvoke(Event.findOneAndUpdate({
            _id: event
        }, {
            $pull: {
                snippets: {
                    _id: snippet        
                }
            }
        }).lean(), 'exec').then(function (event) {
            res.send(200);
        }).fail(onError(res)).done(onDone);
    },
    addEventTask: function (req, res) {
        var event = req.params.event;

        Q.ninvoke(Event.findOneAndUpdate({
            _id: event
        },{
            $push: {
                tasks: req.body 
            }
        }).lean(), 'exec').then(function (event) {
            res.send(200, event.tasks[event.tasks.length - 1]);
        }).fail(onError(res)).done(onDone);
    }, 
    editEventTask: function (req, res) {
        var event = req.params.event;
        var task = req.params.task;
        Q.ninvoke(Event.findOneAndUpdate({
            _id: event,
            'tasks._id': task 
        },{
            $set: {
                'tasks.$.title': req.body.title,
                'tasks.$.timestamp': req.body.timestamp,
                'tasks.$.task': req.body.task
            }
        }).lean(), 'exec').then(function (event) {
            res.send(200);
        }).fail(onError(res)).done(onDone);
    },
    deleteEventTask: function (req, res) {
        var event = req.params.event;
        var task = req.params.task;
        Q.ninvoke(Event.findOneAndUpdate({
            _id: event
        }, {
            $pull: {
                tasks: {
                    _id: task
                }
            }
        }).lean(), 'exec').then(function (event) {
            res.send(200);
        }).fail(onError(res)).done(onDone);
    },

    changeVisibility: function (req, res) {
        var event = req.params.event;
        var visible = req.params.visible === 'true' ? true : false;

        Q.ninvoke(Event.findOneAndUpdate({
            _id: event
        }, {
            $set: {
                visible: visible
            }
        }).lean(), 'exec').then(function (event) {
            res.send(200);
        }).fail(onError(res)).done(onDone);
    }

};

module.exports = Events;

