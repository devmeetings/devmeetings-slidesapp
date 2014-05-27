var DeckModel = require('../../models/deck');


exports.onSocket = function (log, socket) {
    
    var broadcastUpdate = function (data) { 
        socket.broadcast.to(socket.editName).emit('slide.edit.update', data);
    }

    var onGetDeck = function (data, res) {
        socket.editName = data.editName;
        socket.join(data.editName);         // name of the subscribe room
    
        Model.findById(data.params.id, function (err, deck) {
            if (err) {
                console.log(data);
                console.log(err);
                return;
            }
            res(deck); 
        });
    };

    var onDeleteDeck = function (data, res) {
        DeckModel.findByIdAndRemove(data.params.id, function (err, deck) {
            if (err) {
                console.log(data);
                console.log(err);
                return;
            }
            broadcastUpdate(data); // TODO: format data properly
        });
    };

    var onPutDeck = function (data, res) {
        // Cannot specify _id
        delete data.body._id;
        
        DeckModel.findByIdAndUpdate(data.params.id, data.body, { upsert: true }, function (err, deck) {
            if (err) {
                console.log(data);
                console.error(err);
                return;
            }
            broadcastUpdate(data); // TODO: format data properly
        });
    };

    socket.on('slide.edit.get', onGetDeck);
    socket.on('slide.edit.delete', onDeleteDeck);
    socket.on('slide.edit.put', onPutDeck);


};
