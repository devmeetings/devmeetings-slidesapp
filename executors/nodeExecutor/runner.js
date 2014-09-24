var requireWhitelist = ['fs', 'http', 'os', 'path', 'crypto', 'net', 'https', 'util', 'url', 'zlib', 'tty', 'edge'];

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
    var obj = JSON.parse(msg);

    var vm = require("vm");

    var output = [];
    vm.runInNewContext(obj.code, {
        console: {
            log: function() {
                var args = [].slice.call(arguments);
                output.push(args);
                console.log.apply(console, args);
            }
        },
        require: function(module) {
            if (requireWhitelist.indexOf(module) === -1) {
                throw Error("Unknown module " + module);
            }
            return require(module);
        }
    });
    process.send({
        success: true,
        result: output
    }); //Send the finished message to the parent process
});
