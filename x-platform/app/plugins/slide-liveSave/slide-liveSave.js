var LZString = require('lz-string');
var Participants = require('../../services/participants');
var Snapshot = require('../../models/snapshot');
var _ = require('lodash');

exports.onSocket = function (log, socket, io) {
  
    // deckId
    // slideId
    // timestamp
    // data
    var saveCode = function (data, res) {
        Participants.getClientData(socket).done (function (clientData) {
            var snap = {
                deckId: data.deckId,
                slideId: data.slideId,
                userId: clientData.user.userId,
                timestamp: data.timestamp,
                data: data.data
            };
            
            Snapshot.create(snap);
        }, console.error);
    };



    var loadCode = function (data, res) {
    
    };

    socket.on('slide.code.save', saveCode);
    socket.on('slide.code.load', loadCode);
};



