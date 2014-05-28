var DeckModel = require('../../models/deck');


exports.onSocket = function (log, socket) {
    
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

    socket.on('slide.edit.put', onPutDeck);

};
