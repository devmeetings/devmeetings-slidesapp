var states = require('../services/states');
var logger = require('../../config/logging');

function sendError(res) {
  return function(err) {
    logger.error(err);
    res.status(400).send(err);
  };
}

exports.get = function(req, res) {
  'use strict';

  states.getForWorkspaceId(req.params.id).done(function(statesList) {
    res.send(statesList);
  }, sendError(res));
};

exports.since = function(req, res) {
  'use strict';

  states.getSinceId(req.params.id).done(function(history) {
    res.send(history);
  }, sendError(res));

};

exports.convertToRecording = function(req, res) {
  'use strict';

  var eventId = req.params.eventId;
  states.convertToRecording(eventId, req.params.id, req.params.from, req.params.to).done(function() {
    res.sendStatus(200);
  }, sendError(res));

};
