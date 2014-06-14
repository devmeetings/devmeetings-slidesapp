var StreamModel = require('../models/stream');
var pluginEvents = require('../plugins/events');

var Stream = {

    post: function(streamId, message, type, data, userId) {

        return StreamModel.create({
            streamId: streamId,
            message: message,
            type: type,
            data: data,
            userId: userId,
            timestamp: new Date()
        }).then(function(data) {

            pluginEvents.emit('stream.update', streamId);
            return data;
        });
    },


    getLatest: function(streamId, max) {
        return StreamModel.find({
            streamId: streamId
        }, {}, {
            timestamp: -1
        }).limit(max).exec();
    }

};

module.exports = Stream;