var Q = require('q');
var _ = require('lodash');
var Participants = require('../../services/participants');
var pluginsEvents = require('../events');
var TaskData = require('../../services/task-data');


var taskRoom = function(slideId, taskHash) {
    return slideId + taskHash + '_task';
};

exports.onSocket = function(log, socket, io) {

    var broadcastState = function(slideId, taskHash) {
        (_.throttle(function() {
            var room = taskRoom(slideId, taskHash);
            Participants.getParticipants(io, room).then(function(participants) {
                var participantsIds = _.uniq(_.map(participants, function(object) {
                    return object.user._id;
                }));
                return TaskData.getTaskDataForUsers(slideId, participantsIds);
            }).then(function(taskDataArray) {
                var result = {
                    total: 0,
                    solved: 0
                };

                _.forEach(taskDataArray, function(taskData) {
                    var task = _.find(taskData.tasks, function(object) {
                        return object.hash === taskHash;
                    });
                    result.total += (task ? 1 : 0);
                    result.solved += (task && task.done ? 1 : 0);
                });
                io.sockets. in (room).emit('microtasks.counter.notify' + taskHash, result);
            });
        }, 1000))();
    };

    var saveTaskAsDone = function(slideId, taskHash, done) {
        return Participants.getClientData(socket).then(function(clientData) {
            return TaskData.getOrCreateTaskData(slideId, clientData.user._id);
        }).then(function(taskData) {
            var task = _.find(taskData.tasks, function(task) {
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
            taskData.save(function(err, taskData) {
                if (err) {
                    log(err);
                }
                result.resolve(taskData);
            });
            return result.promise;
        });
    };

    // required: 
    // data.taskHash
    // data.slideId
    var socketWatchLock = false;
    var watchTasks = function(data, res) {
        if (socketWatchLock) {
            _.delay(watchTasks, 200, data, res);
            return;
        }
        socketWatchLock = true;

        socket.set('taskData', {
            slideId: data.slideId,
            taskHash: data.taskHash
        });
        var room = taskRoom(data.slideId, data.taskHash);
        socket.join(room);
        saveTaskAsDone(data.slideId, data.taskHash, false).then(function(taskData) {
            socketWatchLock = false;
            broadcastState(data.slideId, data.taskHash);
        });
    };

    // required: 
    // data.slideId
    // data.taskHash
    var markTaskAsDone = function(data, res) {
        saveTaskAsDone(data.slideId, data.taskHash, true).then(function(taskData) {
            broadcastState(data.slideId, data.taskHash);
        });
    };


    // currently it triggers only when user leave the deck
    var onDisconnect = function(data, res) {
        socket.get('taskData', function(err, taskData) {
            if (err || !taskData) {
                return;
            }

            var room = taskRoom(taskData.slideId, taskData.taskHash);
            socket.leave(room);
            broadcastState(taskData.slideId, taskData.taskHash);
        });
    };

    socket.on('microtasks.counter.watch', watchTasks);
    socket.on('microtasks.counter.done', markTaskAsDone);
    socket.on('disconnect', onDisconnect);
};