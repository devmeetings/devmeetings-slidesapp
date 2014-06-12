var Participants = require('../../services/participants');

exports.onSocket = function(log, socket) {
    
    var getTaskData = function(data, res) {
        
    };

    var markTaskAsDone = function(data, res) {
    
    };

    
    socket.on('microtasks.counter.done', markTaskAsDone);
};


