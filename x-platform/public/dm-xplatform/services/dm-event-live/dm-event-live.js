/* jshint esnext:true */
import * as xplatformApp from 'xplatform/xplatform-app';
import * as _ from '_';

class EventLive {

  constructor(Sockets, dmPlayer) {
    _.extend(this, {
      Sockets, dmPlayer
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

  watchWorkspace($scope, workspaceId, cb) {
    this.Sockets.emit('state.subscribe', workspaceId);
    this.Sockets.on('state.patches', cb);

    $scope.$on('$destroy', () => {
      this.Sockets.emit('state.unsubscribe', workspaceId);
      this.Sockets.off('state.patches', cb);
    });
  }

  createWorkspacePlayerSource($scope, workspaceId, statesaveId, initialState) {
    let player = this.dmPlayer.createPlayerSource(statesaveId, initialState);

    this.watchWorkspace($scope, workspaceId, (patches) => {
      $scope.$apply(() => {
        player.applyPatchesAndId(patches);
      });
    });
  }
}


xplatformApp.service('dmEventLive', EventLive);
