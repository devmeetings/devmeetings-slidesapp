var slidesaves = require('../../models/slidesave');

exports.initApi = function (app, authenticated, app2, router2, logger) {
  'use strict';

  // TODO Authorized admin?
  app.post('/workspace/reset/:hash', authenticated, function (req, res) {
    var hash = req.params.hash;

    console.log(hash);
    slidesaves.remove({
      _id: hash
    }, function (err, ok) {
      if (err) {
        console.error(err);
        res.status(400).send(err);
        return;
      }
      res.send('' + ok);
    });
  });
};

