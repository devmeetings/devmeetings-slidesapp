var Q = require('q');
var logger = require('../../../config/logging');
var Event = require('../../models/event');
var Ranking = require('../../models/ranking');
var EventTiming = require('../../models/eventTiming');
var hardcodedDashboard = require('./hardcodedDashboard');
var _ = require('lodash');

logger.info('Loading dashboard plugin.');
exports.onSocket = function (log, socket, io) {
  'use strict';

  logger.info('New client conntected to dashboard');

  socket.on('dashboard.fetch', fetchDashboardForClient);

  function fetchDashboardForClient (data, ack) {
    logger.info('Client is fetching dashboard.');

    getDashboard(hardcodedDashboard).done(function (dashboard) {
      logger.info('Sending dashboard to client');
      ack(dashboard);
    });
  }
};

function getVisibleEvents () {
  return Q.when(Event.find({
    removed: {
      $ne: true
    },
    visible: true
  }).lean().exec());
}

function getUsersRanks (activeEventsIds) {
  return Q.when(Ranking.find({
    event: {
      $in: activeEventsIds
    }
  }).populate('user').lean().exec());
}

function getEventTimings (eventTimingsIds) {
  return Q.when(EventTiming.find({
    id: {
      $in: eventTimingsIds
    }
  }).lean().exec());
}

function getActiveEventsIds (activeEvents) {
  return _.map(activeEvents, function (event) {
    return event._id.toString();
  });
}

function getEventFromHardModelRandomly (hardcodedActiveEvents) {
  var lastIdx = hardcodedActiveEvents.length - 1;
  var randomIdx = _.random(lastIdx);

  return hardcodedActiveEvents[randomIdx];
}

function assignUsersRanksToEvents (activeEvents, usersRanks) {
  for (var i = 0; i < activeEvents.length; i++) {
    var event = activeEvents[i];
    event.ranking = {};
    event.ranking.ranks = [];
    for (var i2 = 0; i2 < usersRanks.length; i2++) {
      var usersRank = usersRanks[i2];
      if (usersRank.event.toString() === event._id.toString()) {
        event.ranking.ranks.push(usersRank);
      }
    }
  }
  return activeEvents;
}

function getEventTimingsId (event) {
  var tempArr = event.liveLink.split('/');
  var id = tempArr[tempArr.length - 1];
  return id;
}

function getEventTimingsIds (activeEvents) {
  var ids = [];
  for (var i = 0; i < activeEvents.length; i++) {
    var event = activeEvents[i];
    if (event.liveLink) {
      var id = getEventTimingsId(event);
      ids.push(id);
    }
  }
  return ids;
}

function isEventStarted (iterations) {
  return !!iterations;
}

function getEventStartedDate (iterations) {
  return iterations ? iterations[0].startedAt : undefined;
}

function getEventCurrentStageIdx (iterations) {
  for (var i = 0; i < iterations.length; i++) {
    var iteration = iterations[i];
    if (iteration.startedAt && !iteration.finishedAt) {
      return i;
    }
  }
}

function buildCurrentStage (iteration) {
  var currentStage = {
    name: iteration.title,
    startedAt: iteration.startedAt,
    icon: iteration.icon
  };
  return currentStage;
}

function getEventCurrentStage (iterations) {
  if (!iterations) {
    return;
  }

  var iteration;

  var currentStageIdx = getEventCurrentStageIdx(iterations);
  if (currentStageIdx) {
    iteration = iterations[currentStageIdx];
    return buildCurrentStage(iteration);
  }

  iteration = iterations[iterations.length - 1];
  return buildCurrentStage(iteration);
}

function assignTimingsToEvents (activeEvents, eventTimings) {
  for (var evItr = 0; evItr < activeEvents.length; evItr++) {
    for (var timItr = 0; timItr < eventTimings.length; timItr++) {
      var event = activeEvents[evItr];
      if (event.liveLink) {
        var eventTimingId = getEventTimingsId(event);
        var timing = eventTimings[timItr];
        if (eventTimingId === timing.id) {
          event.timing.started = isEventStarted(timing.items);
          event.timing.startedAt = getEventStartedDate(timing.items);
          event.currentStage = getEventCurrentStage(timing.items);
        }
      }
    }
  }
  return activeEvents;
}

function makeDashboardModel (hardcodedDashboard, visibleEvents) {
  var activeEvents = _.map(visibleEvents, function (event) {
    var e = _.cloneDeep(getEventFromHardModelRandomly(hardcodedDashboard.activeEvents));
    e._id = event._id;
    e.name = event.name;
    e.iterations = event.iterations;
    e.liveLink = event.liveLink;
    return e;
  });

  var activeEventsIds = getActiveEventsIds(activeEvents);
  var eventTimingsIds = getEventTimingsIds(activeEvents);

  return getUsersRanks(activeEventsIds).then(function (usersRanks) {
    activeEvents = assignUsersRanksToEvents(activeEvents, usersRanks);

    return getEventTimings(eventTimingsIds).then(function (eventTimings) {
      activeEvents = assignTimingsToEvents(activeEvents, eventTimings);

      return {
        activeEvents: activeEvents
      };
    });
  });
}

function getDashboard (hardcodedDashboard) {
  logger.info('Getting dashboard for him.');

  return getVisibleEvents().then(function (visibleEvents) {
    return makeDashboardModel(hardcodedDashboard, visibleEvents);
  });
}
