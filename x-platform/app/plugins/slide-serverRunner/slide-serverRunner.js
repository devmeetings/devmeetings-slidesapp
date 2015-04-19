var uuid = require('node-uuid');
var _ = require('lodash');
var Q = require('q');
var logger = require('../../../config/logging');
var store = require('../../../config/store');

var Workers = null;

exports.init = function() {
  'use strict';

  var l = function( /* args */ ) {
    var args = [].slice.call(arguments);
    args.unshift('  [ServerRunner]');
    logger.info.apply(logger, args);
  };

  Workers = (function() {

    var ReplyQueue = 'Replies_' + uuid();
    var answers = {};

    var deleteCallbackLater = _.debounce(function deleteCallback(id) {
      delete answers[id];
    }, 90000);

    var maybeAnswer = function(msgString) {
      var msg = JSON.parse(msgString);
      var id = msg.properties.correlationId;
      if (answers[id]) {
        var ans = answers[id];
        // Measure time only once!
        if (ans.timestamp) {
          var time = new Date().getTime() - ans.timestamp;
          l('Received answer in ' + time + 'ms', {
            roundtrip: time
          });
          ans.timestamp = null;
        }
        var response = msg.content;
        ans.callback(response);
        deleteCallbackLater(id);
      }
    };

    store.subscribe(ReplyQueue, maybeAnswer);

    return {
      send: function(Queue, msg, callback) {
        l('Sending message to ' + Queue);

        var corrId = uuid();

        answers[corrId] = {
          timestamp: new Date().getTime(),
          callback: callback
        };

        var storeMessage = {
          content: msg,
          properties: {
            replyTo: ReplyQueue,
            correlationId: corrId,
          }
        };
        store.publish(Queue, JSON.stringify(storeMessage));
      }
    };

  }());
};


var States = require('../../services/states');

function fillData(clientData) {
  'use strict';

  console.log(clientData);
  if (clientData.code) {
    return States.createFromId(clientData.code).then(function(save) {

      console.log(save);
      var code = States.getData(save, clientData.path);
      clientData.code = code.content;
      return clientData;
    });
  }

  if (clientData.files) {
    return States.createFromId(clientData.files).then(function(save) {
      var workspace = States.getData(save, clientData.path);
      // Todo extract files
      var files = Object.keys(workspace.tabs).reduce(function(memo, fileName) {
        var content = workspace.tabs[fileName].content;
        var toName = '/' + fileName.replace('|', '.');

        memo[toName] = content;

        return memo;
      }, {});

      clientData.files = files;
      return clientData;
    });
  }

  return Q.when(clientData);
}

exports.onSocket = function(log, socket, io) {
  'use strict';

  socket.on('serverRunner.code.run', function(clientData) {

    fillData(clientData).done(function(data) {
      data.client = socket.request.user._id;
      Workers.send('exec_' + data.runner, data, function(response) {
        socket.emit('serverRunner.code.result', response);
      });
    });
  });
};
