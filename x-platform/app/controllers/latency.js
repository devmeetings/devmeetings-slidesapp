var Q = require('q');
var Latencies = require('../models/latency');

var Latency = {

  get: function (req, res) {
    Q.when(
      Latencies.find({}).lean().exec()
    ).done(function (data) {
      res.send(data);
    });
  },

  add: function (req, res) {
    var data = req.body.latency;
    Latencies.collection.insert(data, function (err) {
      if (err) {
        console.error(err);
        res.sendStatus(400);
        return;
      }
      res.sendStatus(200);
    });
  }
};

module.exports = Latency;
