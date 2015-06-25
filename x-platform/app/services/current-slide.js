var _ = require('lodash');
var Participants = require('../services/participants');
var pluginEvents = require('../plugins/events');

var slideRoom = function (slide) {
  return slide + '_slide';
};

exports.onSocket = function (log, socket, io) {
  socket.on('slide.current.change', function (slide) {
    var slideData = socket.slideData;
    if (!slideData) {
      return;
    }
    var name1 = slideRoom(slideData.slide);
    var name2 = slideRoom(slide[0]);

    socket.leave(name1);
    socket.join(name2);

    pluginEvents.emit('rejoin', socket, {
      joined: false,
      name: name1
    });
    pluginEvents.emit('rejoin', socket, {
      joined: true,
      name: name2,
      msg: 'slide.current.change',
      args: slide
    });

    socket.slideData = {
      slide: slide[0]
    };
  });
};

exports.getSlideUsers = function (io, slide) {
  return Participants.getParticipants(io, slideRoom(slide)).then(function (participants) {
    return _.uniq(_.map(participants, function (object) {
      return object.user._id;
    }));
  });
};
