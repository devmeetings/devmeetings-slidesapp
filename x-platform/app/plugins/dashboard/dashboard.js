var Q = require('q');
var logger = require('../../../config/logging');
var Event = require('../../models/event');
var Ranking = require('../../models/ranking');
var EventTiming = require('../../models/eventTiming');
var hardcodedDashboard = require('./hardcodedDashboard');
var _ = require('lodash');
var moment = require('moment');

logger.info('Loading dashboard plugin.');
exports.onSocket = function (log, socket, io) {
  'use strict';

  socket.on('dashboard.fetch', fetchDashboardForClient);

  function fetchDashboardForClient (data, ack) {
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

function getEventsTimings (eventsTimingsIds) {
  return Q.when(EventTiming.find({
    id: {
      $in: eventsTimingsIds
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
  return activeEvents.map(function assignRanks (event) {
    event.ranking = {};
    event.ranking.ranks = usersRanks.filter(function eventHasUsersRank (usersRank) {
      return usersRank.event.toString() === event._id.toString();
    });
    return event;
  });
}

function getEventsTimingsId (event) {
  var tempArr = event.liveLink.split('/');
  var id = tempArr[tempArr.length - 1];
  return id;
}

function hasLiveLink (event) {
  return !!event.liveLink;
}

function getEventsTimingsIds (activeEvents) {
  return activeEvents
    .filter(hasLiveLink)
    .map(getEventsTimingsId);
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

function getEventExpectedEndDate (iterations, name) {
  var currentStageIdx = getEventCurrentStageIdx(iterations);
  if (!currentStageIdx) {
    return false;
  }
  var minutesToEnd = 0;
  for (var i = currentStageIdx; i < iterations.length; i++) {
    minutesToEnd = minutesToEnd + iterations[i].time;
  }
  var currentIteration = iterations[currentStageIdx];
  var expectedEnd = moment(currentIteration.startedAt).add(minutesToEnd, 'minutes');
  return expectedEnd;
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

// function assignTiming (timing, event) {
//   if (!hasLivelink(event)) {
//     return;
//   }
//   var eventTimingId = getEventsTimingsId(event);
//   if (eventTimingId === timing.id) {
//     event.timing.started = isEventStarted(timing.items);
//     event.timing.startedAt = getEventStartedDate(timing.items);
//     event.timing.expectedEnd = getEventExpectedEndDate(timing.items, timing.id);
//     event.currentStage = getEventCurrentStage(timing.items);
//   }
//   return event;
// }

function assignTimingsToEvents (activeEvents, eventsTimings) {
  // return activeEvents
  //   .map(function (event) {
  //     return eventsTimings.map(
  //       function (timing) { return assignTiming(timing, event); }, event
  //     );
  //   });

  for (var evItr = 0; evItr < activeEvents.length; evItr++) {
    for (var timItr = 0; timItr < eventsTimings.length; timItr++) {
      var event = activeEvents[evItr];
      if (event.liveLink) {
        var eventTimingId = getEventsTimingsId(event);
        var timing = eventsTimings[timItr];
        if (eventTimingId === timing.id) {
          event.timing.started = isEventStarted(timing.items);
          event.timing.startedAt = getEventStartedDate(timing.items);
          event.timing.expectedEnd = getEventExpectedEndDate(timing.items, timing.id);
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
  var eventsTimingsIds = getEventsTimingsIds(activeEvents);

  return getUsersRanks(activeEventsIds).then(function (usersRanks) {
    activeEvents = assignUsersRanksToEvents(activeEvents, usersRanks);

    return getEventsTimings(eventsTimingsIds).then(function (eventsTimings) {
      activeEvents = assignTimingsToEvents(activeEvents, eventsTimings);

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
