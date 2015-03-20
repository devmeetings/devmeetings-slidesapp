var common = require('./index');

function sendError(e) {
  process.send({
    success: false,
    errors: [e.toString()],
    stacktrace: e.stack.split("\n")
  });
}

process.on("uncaughtException", function(e) {
  sendError(e);
  process.exit(-1);
});

//The runner.js is ran in a separate process and just listens for the message which contains code to be executed
process.on('message', function(msg) {
  var obj = msg.msg;

  var consoleMock = common.consoleMock();

  consoleMock.onMessage = function() {
    process.send({
      success: true,
      result: consoleMock.output
    });
  };

  var env = msg.env;

  common.run(
    obj,
    env,
    consoleMock.console,
    function(err) {

      if (err) {
        sendError(err);     
        return;
      }

      consoleMock.onMessage();
    }
  );

});
