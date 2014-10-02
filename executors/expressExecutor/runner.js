var requireWhitelist = ['express', 'http', 'path', 'vm', 'cors',
    'crypto', 'net', 'https', 'util', 'url', 'zlib', 'tty',
    'socket.io', 'connect', 'concat-stream', 'websocket', 'npmlog', 'semver',
    'events', 'stream', 'domain', 'fs', 'edge'
];



process.on("uncaughtException", function(e) {
    process.send({
        success: false,
        errors: [e.toString()],
        stacktrace: e.stack.split("\n")
    });
    process.exit(-1);
});
//The runner.js is ran in a separate process and just listens for the message which contains code to be executed
process.on('message', function(msg) {
    var obj = msg.msg;

    var vm = require("vm");

    var output = [];

    var asyncReply = function() {
        process.send({
            success: true,
            result: output
        });
    };

    vm.runInNewContext(obj.code, {
        Buffer: Buffer,
        console: {
            log: function() {
                var args = [].slice.call(arguments);
                output.push(args);
                console.log.apply(console, args);
                asyncReply();
            }
        },
        require: function(module) {
            if (requireWhitelist.indexOf(module) === -1) {
                throw Error("Unknown module " + module);
            }
            return require(module);
        },
        process: {
            env: {
                PORT: msg.port
            }
        },
        setTimeout: setTimeout,
        __dirname: __dirname
    });
});
