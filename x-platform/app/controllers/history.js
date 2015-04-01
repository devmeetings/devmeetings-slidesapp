var states = require('../services/states');


exports.get = function(req, res) {
  'use strict';

  states.getForWorkspaceId(req.params.id).done(function(statesList) {
    res.send(statesList);
  });
};
