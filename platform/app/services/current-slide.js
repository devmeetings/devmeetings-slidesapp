var _ = require('lodash');
var Q = require('q');
var Participants = require('../services/participants'); 

var slideRoom = function (slide) {
    return slide + '_slide'; 
};

exports.onSocket = function (log, socket, io) {
    socket.on('slide.current.change', function (slide) {
        socket.get('slideData', function (err, slideData) {
            if (err || !slideData) {
                return;
            }
            socket.leave(slideRoom(slideData.slide));
            socket.join(slideRoom(slide[0]));
            socket.set('slideData', {
                slide: slide[0]
            });
        });
    });
};

exports.getSlideUsers = function (io, slide) {
    return Participants.getParticipants(io, slideRoom(slide)).then( function (participants) {
        return _.uniq(_.map(participants, function (object) {
            return object.user._id;
        }));
    });
};

