var Q = require('q'),
  Ranking = require('../../models/ranking'),
  eventRoom = require('../eventRoom');

exports.onSocket = function(log, socket, io) {
  'use strict';
  console.log("Ranking init.");

  function updateRanking(data, ack) {
    var eventId = data.eventId;
    var taskIdx = data.taskIdx;
    var iterationIdx = data.iterationIdx;
    var isDone = data.isDone;

    var update = {};
    update['data.' + iterationIdx + '_' + taskIdx] = {
      isDone: isDone,
      updateDate: new Date()
    };

    Q.when(Ranking.update({
      eventId: eventId,
      userId: socket.request.user._id
    }, update, {
      upsert: true
    }).exec()).then(function() {
      return fetchRanking(eventId);
    }).done(function(ranking) {
      socket.broadcast.to(eventRoom(eventId)).emit('ranking', ranking);
      ack(ranking);
    });
  }

  function fetchRanking(eventId) {
    return Q.when(Ranking.find({
      eventId: eventId
    }).lean().exec()).then(function(rankings) {
      return rankings.reduce(function(r, userRanking) {
        r[userRanking.userId] = userRanking.data;
        return r;
      }, {});
    });
  }

  function fetchRankingForClient(eventId, ack) {
    fetchRanking(eventId).done(ack);
  }

  socket.on('ranking.done', updateRanking);
  socket.on('ranking.fetch', fetchRankingForClient);
};
