var pluginsEvents = require('../events');
var Participants = require('../../services/participants');
var SlideData = require('../../services/slide-data');


var sendSlideData = function (slideData, res) {
};


exports.initSockets = function(io) {
    var sendTasksStatus = function(roomId) {
        // update number of people who did these tasks
        //        
    };

    pluginsEvents.on('room.joined', sendTasksStatus);
    pluginsEvents.on('room.left', sendTasksStatus);
};

exports.onSocket = function(log, socket, io) {
    
    var watchTasks = function(data, res) {
        Participants.getParticipants(io, data.deck).then( function (participants) {
            SlideData.findBySlideIdOrCreate(data.slideId, function (err, slideData) {
                if (err) {
                    console.error(err);
                    return;
                }
                sendSlideData(slideData,  res);
            });
        });
    };


    var markTaskAsDone = function(data, res) {

        var clientData = socket.get('clientData');
        var userId = clientData.user.userId;


    };

    socket.on('microtasks.counter.watch', watchTasks);
    socket.on('microtasks.counter.done', markTaskAsDone);
};


