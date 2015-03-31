/* jshint esnext:true */
import * as xplatformApp from 'xplatform/xplatform-app';
import * as _ from '_';

class EventLive {

  constructor(Sockets) {
    _.extend(this, {
      Sockets
    });
  }

  listenToUsersOnline($scope, eventId, workspaceId, cb) {
    this.Sockets.emit('event.join', {
      eventId, workspaceId
    }, function(users) {
      cb({
        action: 'initial',
        eventId: eventId,
        users: users
      });
    });
    this.Sockets.on('event.user', cb);

    $scope.$on('$destroy', () => {
      this.Sockets.off('event.user', cb);
      this.Sockets.emit('event.leave', eventId);
    });
  }

  listenToUserEvents($scope, userId, cb) {
    this.Sockets.emit('state.subscribe', userId);
    this.Sockets.on('state.patches', cb);

    $scope.$on('$destroy', () => {
      this.Sockets.emit('state.unsubscribe', userId);
      this.Sockets.off('state.patches', cb);
    });
  }
}


xplatformApp.service('dmEventLive', EventLive);
