var requireWhitelist = ['fs', 'http', 'os', 'path', 'crypto', 'net', 'https', 'util', 'url', 'zlib', 'tty'];

//The runner.js is ran in a separate process and just listens for the message which contains code to be executed
process.on('message', function(msg) {
    try {
        var obj = JSON.parse(msg);

        var vm = require("vm");

        console.log(obj.code);
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
            ok: true,
            result: JSON.stringify(output, null, 2)
        }); //Send the finished message to the parent process
    } catch (e) {
        process.send({
            ok: false,
            errors: [e.toString()]
        });
    }
});