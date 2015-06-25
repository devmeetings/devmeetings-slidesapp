var Q = require('q'),
  Ranking = require('../../models/ranking'),
  eventRoom = require('../eventRoom'),
  logger = require('../../../config/logging');

exports.onSocket = function (log, socket, io) {
  'use strict';

  function updateRanking (data, ack) {
    var eventId = data.eventId;
    var taskIdx = data.taskIdx;
    var iterationIdx = data.iterationIdx;
    var isDone = data.isDone;
    var noOfTasks = data.noOfTasks;

    var update = {};
    update['data.' + iterationIdx + '_' + taskIdx] = {
      isDone: isDone,
      updateDate: new Date()
    };
    update['counts.' + iterationIdx] = noOfTasks;

    Q.when(Ranking.update({
      event: eventId,
      user: socket.request.user._id
    }, update, {
      upsert: true
    }).exec()).then(function () {
      return fetchRanking(eventId);
    }).done(function (ranking) {
      socket.broadcast.to(eventRoom(eventId)).emit('ranking', ranking);
      ack(ranking);
    }, function (err) {
      logger.error(err);
      ack({});
    });
  }

  function fetchRanking (eventId) {
    return Q.when(Ranking.find({
      event: eventId
    }).populate('user').select('-user.email -user.userId -user.acl').lean().exec()).then(function (rankings) {
      return rankings.reduce(function (r, userRanking) {
        r[userRanking.user._id] = userRanking;
        return r;
      }, {});
    });
  }

  function fetchRankingForClient (eventId, ack) {
    fetchRanking(eventId).done(ack, function (err) {
      logger.error(err);
      ack({});
    });
  }

  socket.on('ranking.done', updateRanking);
  socket.on('ranking.fetch', fetchRankingForClient);
};
