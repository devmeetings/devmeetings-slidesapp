var Q = require('q');
var _ = require('lodash');
var Participants = require('../../services/participants');
var pluginsEvents = require('../events');
var TaskData = require('../../services/task-data');
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
                            solved: task.solvedByUsers ? _.intersection(task.solvedByUsers, participantsIds).length : 0,
                            task: task.hash
                        };
                    });

                    io.sockets.in(room).emit('microtasks.counter.notify', solvedArray);
                });
            });
        }, 1000))();
    };



    var saveTaskAsDone = function(slideId, taskHash, done) {
        return Participants.getClientData(socket).then( function (clientData) {
            return TaskData.getOrCreateTaskData( slideId, clientData.user.userId );
        }).then( function (taskData) {
            log('db taskdata: ', taskData);
            var task =_.find(taskData.tasks, function (task) {
                return task.hash === taskHash;
            });
            if (!task) {
                task = {
                    hash: taskHash,
                    done: done
                };
                taskData.tasks.push(task);
            } else {
                task.done = task.done || done;
            }

            var result = Q.defer();   
            taskData.markModified('tasks');
            taskData.save( function (err, taskData) {
                if (err) {
                    log(err);
                }
                result.resolve(taskData);
            });
            return result.promise;
        }); 
    };

    // required: 
    // data.tashHash
    // data.slideId
    var watchTasks = function(data, res) {
        log('WATCH :', data);
        socket.set('taskData', {
            slideId: data.slideId
        }); 
        var room = taskRoom(data.slideId);
        socket.join(room);
        saveTaskAsDone(data.slideId, data.taskHash, false).then (function (taskData) {
            log('WATCH1 :', taskData);
        });

        //broadcastState(data.slideId);
    };

    // required: 
    // data.slideId
    // data.taskHash
    var markTaskAsDone = function(data, res) {
        log('MARK :', data);
        
        saveTaskAsDone(data.slideId, data.taskHash, true).then (function (taskData) {
            log('MARK1 :', taskData);
        });
        

        /*var room = taskRoom(data.slideId);
        Participants.getParticipants(io, room).then( function (participants) {
            var participantsIds = _.uniq(_.map(participants, function (object) {
                return object.user.userId;
            }));

            return TaskData.getTaskDataForUsers(data.slideId, participantsIds);
        }).then( function (taskDataArray) {
            log('MARK1 :', taskDataArray);
            var task = _.find(tasks
        });*/

        /*
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
                if (_.contains(task.solvedByUsers, clientData.user.userId)){
                    return;
                }

                task.solvedByUsers.push(clientData.user.userId);
                SlideData.updateSlideData(slideData, function (err, slideData) {
                    if (err) {
                        console.error(err);
                        return;
                    }
                    broadcastState(data.slideId);
                });
            });
        });
        */
    };


    // TODO fix this, cause currently it triggers only when user leave the deck
    var onDisconnect = function(data, res) {
        socket.get('taskData', function (err, taskData) {
            if (err || !taskData) {
                return;
            }
            
            var room = taskRoom(taskData.slideId);
            socket.leave(room);
            //broadcastState(taskData.slideId);
        });
    };

    socket.on('microtasks.counter.watch', watchTasks);
    socket.on('microtasks.counter.done', markTaskAsDone);
    socket.on('disconnect', onDisconnect); 
};
 

