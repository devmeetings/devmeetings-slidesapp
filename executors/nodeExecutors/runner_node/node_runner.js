var common = require('../index');

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

    var consoleMock = common.consoleMock();

    common.run(
      obj,
      {},
      consoleMock.console
    );

    process.send({
        success: true,
        result: consoleMock.output
    }); //Send the finished message to the parent process
});
