var Q = require('q');
var logger = require('../../../config/logging');

logger.info('Loading dashboard plugin.');
exports.onSocket = function (log, socket, io) {
  'use strict';

  logger.info('New client conntected to dashboard');

  socket.on('dashboard.fetch', fetchDashboardForClient);

  function fetchDashboardForClient(data, ack) {
    logger.info('Client is fetching dashboard.');

    getDashboard().done(function (dashboard) {
      logger.info('Sending dashboard to client', dashboard);
      ack(dashboard);
    });
  }

};

function getDashboard () {
  var dashboard = 'Hello World!';
  logger.info('Getting dashboard for him.');
  return Q.when(dashboard);
}
