/* jshint esnext:true */
import * as xplatformApp from 'xplatform/xplatform-app';
import * as _ from '_';

class Ranking {

  //TODO [ToDr] This is shitty - taking eventId from $stateParams
  constructor(Sockets, $q, dmUser, $stateParams) {
    _.extend(this, {
      Sockets, $q, dmUser, $stateParams
    });

    // TODO [ToDr] We are assuming that user is inside proper room!
    this.Sockets.on('ranking', (ranking) => {
      this.onNewRanking(ranking);
    });

    this.dmUser.getCurrentUser().then((user) => {
      this.user = user;
    });
  }

  onNewRanking(ranking) {
    this.currentRanking = ranking;
  }

  markAsDone(taskIdx, isDone) {
    var self = this;
    var d = this.$q.defer();
    this.Sockets.emit('ranking.done', {
      taskIdx: taskIdx,
      isDone: isDone,
      eventId: this.$stateParams.event
    }, (ranking) => {
      self.currentRanking = ranking;
      d.resolve(ranking);
    });
    return d.promise;
  }

  getCurrentRanking() {
    if (this.currentRanking) {
      return this.$q.when(this.currentRanking);
    }
    var eventId = this.$stateParams.event;
    // Fetch ranking!
    var d = this.$q.defer();
    this.Sockets.emit('ranking.fetch', eventId, function(ranking) {
      this.currentRanking = ranking;
      d.resolve(ranking);
    });
    return d.promise;
  }

  getCurrentRankingForUser() {
    var self = this;
    return this.getCurrentRanking().then((currentRanking) => {
      var userId = self.user.result._id;
      return currentRanking[userId] || {};
    });
  }
}


xplatformApp.service('dmRanking', Ranking);
