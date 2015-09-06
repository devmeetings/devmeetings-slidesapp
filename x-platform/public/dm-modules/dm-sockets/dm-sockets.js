/* globals define */
define(['_', 'angular', 'socket.io', 'asEvented', './guid'], function (_, angular, io, asEvented, guid) {
  var CreateWebSocket = function (targetOrigin, $window, $location) {
    var WebSocket = {
      _socket: null,

      _initialize: function () {
        var deckId = (typeof $window.slides === 'undefined') ? '-' : $window.slides;
        var protocol = $location.protocol();
        var url = $location.host() + ':' + $location.port();
        this._socket = io.connect(protocol + '://' + url + '/?deck=' + deckId);
        var s = this._socket;
        this.emit = s.emit.bind(s);
        this.on = s.on.bind(s);
        this.off = s.off.bind(s);
        this._createRoomReconnector();

        $window.addEventListener('message', function (ev) {
          var data = ev.data;
          var target = ev.source;

          if (data.type === 'socketEvent') {
            var cb;
            if (data.callback) {
              cb = function (data2) {
                target.postMessage({
                  type: 'socketCallback',
                  data: data2,
                  callback: data.callback
                }, targetOrigin);
              };
            }

            this.emit(data.eventName, data.data, cb);
          }
          if (data.type === 'socketListen') {
            this.on(data.eventName, this._createEventForwarder(target, data.eventName));
          }
          if (data.type === 'socketStop') {
            this.off(data.eventName);
          }
        }.bind(this));
      },

      _createEventForwarder: function (target, evName) {
        return function (data) {
          target.postMessage({
            type: 'socketEvent',
            eventName: evName,
            data: data
          }, targetOrigin);
        };
      },

      _createRoomReconnector: function () {
        var s = this._socket;

        var rooms = [];

        s.on('reconnect', function () {
          // Clear out rooms because we will get another rejoin events.
          var toJoin = rooms.slice();
          rooms.length = 0;
          toJoin.forEach(function (room) {
            s.emit(room.msg, room.args, function () {});
          });
        });

        s.on('rejoin', function (channel) {
          // Save channel to join later
          if (channel.joined) {
            // check if channel is already there
            var idx = _.map(rooms, 'name').indexOf(channel.name);
            if (idx !== -1) {
              rooms[idx] = channel;
            } else {
              rooms.push(channel);
            }
            return;
          }

          // Remove channel
          _.remove(rooms, {
            name: channel.name
          });
        });
      }
    };
    return WebSocket;
  };

  var CreateBaseSocket = function ($window, $rootScope) {
    var BaseSocket = {
      _initialize: function () {
        $window.___hasSockets = true;
        this.on('connect', function () {
          $rootScope.$apply(function () {
            $rootScope.isOffline = false;
          });
        });
        this.on('disconnect', function () {
          $rootScope.$apply(function () {
            $rootScope.isOffline = true;
          });
        });
      }

    };
    return BaseSocket;
  };

  angular.module('dm-sockets', []).factory('Sockets',
    function ($location, $window, $rootScope) {
      var targetOrigin = $window.location;

      var Sockets = CreateWebSocket(targetOrigin, $window, $location);

      // initialize
      var BaseSockets = CreateBaseSocket($window, $rootScope);
      var Socket = _.extend({}, BaseSockets, Sockets);
      Sockets._initialize.call(Socket);
      BaseSockets._initialize.call(Socket);

      return Socket;
    }
  );
});
