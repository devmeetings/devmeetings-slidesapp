var tinylr = require('tiny-lr');
var logger = require('../../../config/logging');
var store = require('../../services/store');

var LiveReloadQueue = 'LiveReload';

module.exports = function (port) {
  'use strict';

  var server = tinylr();
  server.listen(port, function () {
    logger.info('Live reload listening on %d', port);
  });

  store.subscribe(LiveReloadQueue, function (msgString) {
    var msg = JSON.parse(msgString);
    notifyClientsOnUrl(msg.url, msg.files);
  });

  function notifyClientsOnUrl (url, files) {
    Object.keys(server.clients).map(function (id) {
      return server.clients[id];
    }).filter(function (client) {
      var clientUrl = client.url || '';
      return clientUrl.indexOf(url) > -1;
    }).map(function (client) {
      client.reload(files);

      return {
        id: client.id
      };
    });
  }

  return {
    notifyClientsOnUrl: function (url, files) {
      store.publish(LiveReloadQueue, JSON.stringify({
        url: url,
        files: files
      }));
    }
  };
};
