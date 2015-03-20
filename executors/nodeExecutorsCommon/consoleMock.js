module.exports = function() {

  var output = [];

  var consoleMock = {

    log: function() {
      var args = [].slice.call(arguments);
      output.push(args);
      console.log.apply(console, args);
      // TODO EventEmitter?
      self.onMessage();
    },

  };

  var self = {
    output: output,
    onMessage: function() {},
    console: consoleMock
  };

  return self;

};
