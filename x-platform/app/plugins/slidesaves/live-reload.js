var tinylr = require('tiny-lr');

module.exports = function() {
  var port = 35729;

  var server = tinylr();

  server.listen(port);

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
