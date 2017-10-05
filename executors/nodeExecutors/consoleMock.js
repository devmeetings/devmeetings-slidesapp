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

    error: function() {
      var args = [].slice.call(arguments);
      output.push(args);
      console.error.apply(console, args);
      // TODO EventEmitter?
      self.onMessage();
    },

    warn: function() {
      var args = [].slice.call(arguments);
      output.push(args);
      console.warn.apply(console, args);
      // TODO EventEmitter?
      self.onMessage();
    },

    info: function() {
      var args = [].slice.call(arguments);
      output.push(args);
      console.info.apply(console, args);
      // TODO EventEmitter?
      self.onMessage();
    }

  };

  var self = {
    output: output,
    onMessage: function() {},
    console: consoleMock
  };

  return self;

};
