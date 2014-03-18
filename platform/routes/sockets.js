var _ = require('underscore');
var fs = require('fs');

var trainers = [];

var log = function(socket) {
    return function() {
        var args = [].slice.call(arguments);
        args.unshift("[" + socket.id + "] ");
        console.log.apply(console, args);
    };
};

var clients = {};

var sendClientsDataToTrainers = function() {
    trainers.forEach(function(socket) {
        socket.emit('clients', clients);
    });
};
var sendClientsDataLater = _.debounce(sendClientsDataToTrainers, 1000);

var mongo = require('../mongo');

module.exports = function(io) {
    io.on('connection', function(socket) {
        var id = socket.id;
        var clientData = clients[id] = {
            microtasks: {},
            port: 5000 + Math.floor(Math.random() * 3000)
        };

        var l = log(socket);
        l("New client connected");

        socket.on('name', function(name) {
            l("Setting name", name);
            clientData.name = name;
            sendClientsDataLater();
        });

        socket.on('currentSlide', function(slide, presentation) {
            l("Changing currentSlide", slide);
            clientData.slide = slide;
            clientData.presentation = presentation;
            sendClientsDataLater();
        });

        socket.on('microtasks', function(data) {
            clientData.microtasks[data.slideId] = data.microtasks;
            sendClientsDataLater();
        });

        socket.on('trainer', function() {
            trainers.push(socket);
            socket.emit('clients', clients);
        });

        socket.on('solution', function(solutionId) {
            l("Trying to display solution", solutionId);
            if (trainers.indexOf(socket) === -1) {
                return;
            }
            l("Broadcasting solution", solutionId);
            socket.broadcast.emit('solution', solutionId);
        });

        socket.on('codeupdate', function(data) {
            data.timestamp = new Date();
            mongo.code.insert(data, function(err) {
                if (err) throw err;
            });
        });

        socket.on('codesubmit', function(data) {
            data.timestamp = new Date();
            mongo.submit.insert(data, function(err) {
                socket.emit('done');
            });
        });

        socket.on('execute', function(data) {
            var queue = data.queue;
            require('../executors').send(
                queue, {
                    "name": "TestClass",
                    "code": data.code,
                    "port": clientData.port,
                    "client": "Client_" + clientData.port
                }, function(data) {
                    socket.emit('result', {
                        port: clientData.port,
                        queue: queue,
                        data: data
                    });
                });
        });

        socket.on('disconnect', function() {
            l("Disconnected");
            delete clients[id];
            var i = trainers.indexOf(socket);
            if (i > -1) {
                trainers.splice(i, 1);
            }
            sendClientsDataLater();
        });

        var slidesDir = './public/slides/';
        socket.on('getSlidesContent', function(slides) {

            fs.readFile(slidesDir + slides + '.yaml', 'utf8', function(err, data) {
                if (err) {
                    return;
                }
                socket.emit('slidesContent', data);
            });
        });
        socket.on('saveSlidesContent', function(slides, data) {
            fs.writeFile(slidesDir + slides + ".yaml", data);
        });
    });
};