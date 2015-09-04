/* jshint esnext:true */
import xplatformApp from 'dm-xplatform/xplatform-app';
import _ from '_';

class Ranking {

  // TODO [ToDr] This is shitty - taking eventId from $stateParams
  constructor (Sockets, $q, dmUser, $stateParams, $rootScope) {
    _.extend(this, {
      Sockets, $q, dmUser, $stateParams, $rootScope
    });

    // TODO [ToDr] We are assuming that user is inside proper room!
    this.Sockets.on('ranking', (ranking) => {
      this.onNewRanking(ranking);
    });

    this.dmUser.getCurrentUser().then((user) => {
      this.user = user;
    });
  }

  onNewRanking (ranking) {
    this.$rootScope.$apply(() => {
      this.currentRanking = ranking;
    });
  }

  markAsDone (iterationIdx, taskIdx, isDone, noOfTasks) {
    var self = this;
    var d = this.$q.defer();
    this.Sockets.emit('ranking.done', {
      taskIdx: taskIdx,
      isDone: isDone,
      eventId: this.$stateParams.event,
      iterationIdx: iterationIdx,
      noOfTasks: noOfTasks
    }, (ranking) => {
      self.onNewRanking(ranking);
      d.resolve(ranking);
    });
    return d.promise;
  }

  updateUsersGroup (groupName) {
    var self = this;
    var d = this.$q.defer();
    this.Sockets.emit('ranking.group', {
      eventId: this.$stateParams.event,
      groupName: groupName
    }, (ranking) => {
      self.onNewRanking(ranking);
      d.resolve(ranking);
    });
    return d.promise;
  }

  getCurrentRanking () {
    var eventId = this.$stateParams.event;

    if (this.currentRanking && this.lastEventId === eventId) {
      return this.$q.when(this.currentRanking);
    }
    this.lastEventId = eventId;
    // Fetch ranking!
    var d = this.$q.defer();
    var self = this;
    this.Sockets.emit('ranking.fetch', eventId, function (ranking) {
      self.onNewRanking(ranking);
      d.resolve(ranking);
    });
    return d.promise;
  }

  getCurrentRankingForUser () {
    var self = this;
    return this.getCurrentRanking().then((currentRanking) => {
      var userId = self.user.result._id;
      var ranking = currentRanking[userId] || {};
      return ranking.data || {};
    });
  }
}

xplatformApp.service('dmRanking', Ranking);
