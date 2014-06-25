var lzString = require('lz-string');



exports.onSocket = function (log, socket, io) {
    
    var saveCode = function (data, res) {
        
    };

    var loadCode = function (data, res) {
    
    };

    socket.on('slide.code.save', saveCode);
    socket.on('slide.code.load', loadCode);
};



