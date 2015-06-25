/* globals define */
define(['angular', 'dm-xplatform/xplatform-app', '_'], function (angular, xplatformApp, _) {
  xplatformApp.service('dmQuestions', function ($http, $q, Sockets, $rootScope, dmPlayer) {
    var promises = {
    };

    Sockets.on('event.questions.new', function (question) {
      toReturn.allQuestionsForEvent(question.event, false).then(function (qs) {
        qs.push(question);
      });

      $rootScope.$broadcast('event.questions.update');
    });

    Sockets.on('event.questions.comment.new', function (question) {
      toReturn.allQuestionsForEvent(question.event, false).then(function (qs) {
        var oldQ = _.find(qs, function (q) {
          return q._id === question._id;
        });

        oldQ.comments = question.comments;
      });

      $rootScope.$broadcast('event.questions.update');
    });

    var toReturn = {
      allQuestionsForEvent: function (event, download) {
        var result = promises[event];

        if (!result || download) {
          result = $q.defer();
          promises[event] = result;
        }

        if (!download) {
          return result.promise;
        }

        Sockets.emit('event.questions.all', {
          event: event
        }, function (message) {
          result.resolve(message);
        });

        return result.promise;
      },
      createQuestion: function (question) {
        var result = $q.defer();
        var that = this;
        Sockets.emit('event.questions.create', question, function (message) {
          result.resolve();
        });

        return result.promise;
      },
      commentQuestion: function (question, comment, save) {
        var result = $q.defer();
        var that = this;

        dmPlayer.getCurrentStateId().then(function (stateId) {
          Sockets.emit('event.questions.comment.create', {
            question: question._id,
            comment: comment,
            save: save
          }, function (message) {
            result.resolve();
          });
        });
        return result.promise;
      }

    };
    return toReturn;
  });
});
