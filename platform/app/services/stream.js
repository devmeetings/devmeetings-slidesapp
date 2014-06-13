var StreamModel = require('../models/stream');

var Stream = {

    post: function(deckId, message, type, data, userId) {

        return StreamModel.create({
            deckId: deckId,
            message: message,
            type: type,
            data: data,
            userId: userId
        }).exec();

    }

};

module.exports = Stream;