var _ = require('lodash');
var Participants = require('../../services/participants');
var pluginsEvents = require('../events');
var SlideData = require('../../services/slide-data');


var taskRoom = function (slideId) {
    return slideId + '_task';
};

exports.onSocket = function(log, socket, io) {
   
    var broadcastState = function(slideId) {
        (_.throttle(function() {
            var room = taskRoom(slideId);
            Participants.getParticipants(io, room).then( function (participants) {
                SlideData.findBySlideIdOrCreate( slideId, function (err, slideData) {
                    log('WATCHx :', slideData);
                    if (err) {
                        console.error(err);
                        return;
                    }

                    var participantsIds = _.uniq(_.map(participants, function (object) {
                        return object.user.userId;
                    }));
                    if (!slideData.content.microtasks) {
                        slideData.content.microtasks = [];
                    }

                    var solvedArray = _.map(slideData.content.microtasks, function (task) {
                        return {
                            total: participantsIds.length,
                            solved: task.users ? _.intersection(task.users, participants.Ids).length : 0,
                            task: task.hash
                        };
                    });

                    io.sockets.in(room).emit('microtasks.counter.notify', solvedArray);
                });
            });
        }, 1000))();
    };

    // required: 
    // data.slideId
    var watchTasks = function(data, res) {
        log('WATCH :', data);
        socket.set('taskData', {
            slideId: data.slideId
        }); 
        var room = taskRoom(data.slideId);
        socket.join(room); 
        broadcastState(data.slideId);
    };

    // required: 
    // data.slideId
    // data.taskHash
    var markTaskAsDone = function(data, res) {
        log('MARK :', data);
        SlideData.findBySlideIdOrCreate( data.slideId, function (err, slideData) {
            if (err) {
                console.error(err);
                return;
            }
            
            if (!slideData.content.microtasks) {
                slideData.content.microtasks = [];
            }

            var task = _.find(slideData.content.microtasks, function (object) {
                return object.hash === data.taskHash;
            });
            
            if (!task) {
                task = {
                    hash: data.taskHash,
                    solvedByUsers: []
                };
                slideData.content.microtasks.push(task);
            }

            socket.get('clientData', function(err, clientData) {
                task.solvedByUsers.push(clientData.user.userId);
                console.log('MARKa: %j', slideData);
                SlideData.updateSlideData(slideData, function (err, slideData) {
                    if (err) {
                        console.error(err);
                        return;
                    }
                    broadcastState(taskRoom(data.slideId));
                });
            });
        });
    };


    var onDisconnect = function(data, res) {
        socket.get('taskData', function (err, taskData) {
            if (err || !data) {
                return;
            }
            
            var room = taskRoom(taskData.slideId);
            socket.leave(room);
            broadcastState(taskData.slideId);
        });
    };

    socket.on('microtasks.counter.watch', watchTasks);
    socket.on('microtasks.counter.done', markTaskAsDone);
    socket.on('disconnect', onDisconnect); 
};
 

