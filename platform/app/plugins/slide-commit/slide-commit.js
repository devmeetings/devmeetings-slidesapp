var Slides = require('../../services/slides');
var Stream = require('../../services/stream');

var Q = require('q');

exports.onSocket = function(log, socket, io) {

    socket.on('slide.commit', function(data, callback) {
        var parentId = data.parentId;
        var slideContent = data.slideContent;
        var message = data.message;
        var deckId = data.deckId;

        Slides.commitSlide(parentId, slideContent).then(function(data) {
            var user = socket.handshake.user;
            var streams = [deckId, parentId];

            var streamPostPromises = streams.map(function(streamId) {
                return Stream.post(streamId, 'Commit: ' + message + ' by ' + user.name, 'commit', data._id, user.userId);
            });

            var postForkMessage = Stream.post(data._id, 'Slide forked by ' + user.name, 'created', parentId, user.userId);

            return Q.all([postForkMessage].concat(streamPostPromises));
        }).then(callback, function(err) {
            console.error(err);
        });
    });
};