var Slides = require('../../services/slides');
var Stream = require('../../services/stream');

exports.onSocket = function(log, socket, io) {

    socket.on('slide.commit', function(data, callback) {
        var parentId = data.parentId;
        var slideContent = data.slideContent;
        var message = data.message;

        Slides.commitSlide(parentId, slideContent).then(function(data) {
            var user = socket.handshake.user;
            return Stream.post('??', 'Commit: ' + message + ' by ' + user.name, 'commit', data._id, user.userId);
        }).then(callback, function(err) {
            console.error(err);
        });
    });
};