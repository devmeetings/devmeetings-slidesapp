var tinylr = require('tiny-lr');
var logger = require('../../../config/logging');

module.exports = function(port) {
  'use strict';

  var server = tinylr();
  server.listen(port, function(){
    logger.info('Live reload listening on %d', port);
  });

  return {
    notifyClientsOnUrl: function(url, files) {
      var clients = Object.keys(server.clients).map(function(id) {
        return server.clients[id];
      }).filter(function(client) {
        return client.url.indexOf(url) > -1;
      }).map(function(client) {
        client.reload(files);

        return {
          id: client.id
        };
      });

      return clients;
    }
  };
};
