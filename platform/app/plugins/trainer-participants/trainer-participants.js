var pluginsEvents = require('../events');
var DeckModel = require('../../models/deck');
var Participants = require('../../services/participants');
var _ = require('lodash');


var trainersRoom = function(roomId) {
    return roomId + '_trainers';
};

var updateClientData = function(socket, updater) {
    socket.get('clientData', function(err, clientData) {
        updater(clientData);
        socket.set('clientData', clientData);
    });
};

var broadcastClientsToTrainers = function(io, roomId) {
    Participants.getParticipants(io, roomId).then(function(participants) {
        io.sockets.in(trainersRoom(roomId)).emit('trainer.participants', participants);
    }, console.error);
};


var getClient = function(io, roomId, id){
    return _.find(io.sockets.clients(roomId), function(client) {
        return client.id === id;
    });
};


var broadcastTrainerChangeSlide = function(userData, callback) {

    DeckModel.find().where('id').equals(userData.deck).exec(function(err, decks) {
        var deck;
        if (err) {
            console.error(err);
            return;
        }
        deck = decks[0];

        callback(userData, deck);
    });
};


exports.initSockets = function(io) {

    var sendParticipants = function(roomId) {
        broadcastClientsToTrainers(io, roomId);
    };

    pluginsEvents.on('room.joined', sendParticipants);
    pluginsEvents.on('room.left', sendParticipants);

};

exports.onSocket = function(log, socket, io) {
    socket.on('slide.current.change', function(slide) {

        updateClientData(socket, function(clientData) {
            clientData.currentSlide = slide[0];

            broadcastClientsToTrainers(io, clientData.deck);
        });

    });

    socket.on('trainer.register', function(data, callback) {
        // TODO [ToDr] Check authorization
        callback({
            isAuthorized: true
        });

        socket.get('clientData', function(err, data) {
            data.isTrainer = true;
            socket.set('clientData', data);

            // Join trainers room
            socket.join(trainersRoom(data.deck));
            Participants.getParticipants(io, data.deck).then(function(participants) {
                socket.emit('trainer.participants', participants);
            }, console.error);
        });
    });

    socket.on('trainer.follow.nextSlide', function(data) {
        var userSocket = getClient(io, data.deck, data.user.id);
        broadcastTrainerChangeSlide(data, function(userData, deck) {
            var currentSlidePosition = deck.slides.indexOf(data.user.currentSlide);
            userSocket.emit('slide.trainer.change_slide', deck.slides[(++currentSlidePosition % deck.slides.length)]);
        });
    });

    socket.on('trainer.follow.prevSlide', function(data) {
        var userSocket = getClient(io, data.deck, data.user.id);
        broadcastTrainerChangeSlide(data, function(userData, deck) {
            var currentSlidePosition = deck.slides.indexOf(data.user.currentSlide);
            currentSlidePosition = (currentSlidePosition === 0) ? deck.slides.length : currentSlidePosition;
            userSocket.emit('slide.trainer.change_slide', deck.slides[(--currentSlidePosition)]);
        });
    });
};
