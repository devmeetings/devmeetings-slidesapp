var Q = require('q');
var Ranking = require('../../models/ranking');
var eventRoom = require('../eventRoom');
var logger = require('../../../config/logging');

exports.onSocket = function (log, socket, io) {
  'use strict';

  function updateGroup (data, ack) {
    var eventId = data.eventId;
    var groupName = data.groupName;
    var userId = socket.request.user._id;

    console.log('Updating group', eventId, userId, groupName);

    Q.when(Ranking.update({
      event: eventId,
      user: userId
    }, {
      event: eventId,
      user: userId,
      group: groupName,
      $setOnInsert: {
        data: {},
        counts: {}
      }
    }, {
      upsert: true,
      multi: true
    }).exec()).done(
      fetchAndBroadcastRanking(eventId, ack),
      function (err) {
        logger.error(err);
        ack({});
      }
    );
  }

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
    }).exec()).done(
      fetchAndBroadcastRanking(eventId, ack),
      function (err) {
        logger.error(err);
        ack({});
      }
    );
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

  function fetchAndBroadcastRanking (eventId, ack) {
    return function () {
      return fetchRanking(eventId).done(function (ranking) {
        socket.broadcast.to(eventRoom(eventId)).emit('ranking', ranking);
        ack(ranking);
      });
    };
  }

  function fetchRankingForClient (eventId, ack) {
    fetchRanking(eventId).done(ack, function (err) {
      logger.error(err);
      ack({});
    });
  }

  socket.on('ranking.done', updateRanking);
  socket.on('ranking.group', updateGroup);
  socket.on('ranking.fetch', fetchRankingForClient);
};
