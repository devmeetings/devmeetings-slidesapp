var requireWhitelist = ['express', 'http', 'path', 
    'crypto', 'net', 'https', 'util', 'url', 'zlib', 'tty',
    'socket.io', 'connect', 'concat-stream', 'websocket', 'npmlog', 'semver'
    ];

//The runner.js is ran in a separate process and just listens for the message which contains code to be executed
process.on('message', function(msg) {
    try {
        var obj = msg.msg;

        var vm = require("vm");

        var output = [];
        vm.runInNewContext(obj.code, {
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

        // Shitty - handle async?
        var asyncReply = function() {
            process.send({
                success: true,
                result: output
            }); //Send the finished message to the parent process
        };

    } catch (e) {
        process.send({
            success: false,
            errors: [e.toString()]
        });
    }
});