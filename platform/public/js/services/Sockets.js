define(['_', 'slider/slider.plugins', 'socket.io', 'asEvented', 'utils/guid'], function(_, sliderPlugins, io, asEvented, guid) {

    sliderPlugins.factory('Sockets', ['$location', '$window',
        function($location, $window) {
            var targetOrigin = $window.location;

            var WebSocket = {

                _socket: io.connect('http://' + $location.host() + "/?deck=" + slides),

                _initialize: function() {
                    var s = this._socket;
                    this.emit = s.emit.bind(s);
                    this.on = s.on.bind(s);

                    $window.addEventListener('message', function(ev) {
                        var data = ev.data;
                        var target = ev.source;

                        if (data.type === 'socketEvent') {
                            var cb;
                            if (data.callback) {
                                cb = function(data2) {
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
                    }.bind(this));
                },

                _createEventForwarder: function(target, evName) {
                    return function(data) {
                        target.postMessage({
                            type: 'socketEvent',
                            eventName: evName,
                            data: data
                        }, targetOrigin);
                    };
                }
            };


            var ForwardingSocket = {

                _callbacks: {},

                _initialize: function() {
                    // Apply events, but don't override emit
                    var emit = this.emit;
                    asEvented.call(this);
                    this.emit = emit;

                    // Because Socket.IO does not allow to listen to all events 
                    // (and knowing their names at the same time)
                    // We have to add a little aspect to .on method.
                    ['on', 'listen'].map(function(method) {
                        var org = this[method];

                        this[method] = function() {
                            $window.parent.postMessage({
                                type: 'socketListen',
                                eventName: arguments[0]
                            }, targetOrigin);
                            return org.apply(this, arguments);
                        };
                    }, this);

                    $window.addEventListener('message', function(ev) {
                        var data = ev.data;

                        if (data.type === 'socketEvent') {
                            this.trigger(data.eventName, data.data);
                        }
                        if (data.type === 'socketCallback') {
                            var callback = this._callbacks[data.callback];

                            if (callback) {
                                delete this._callbacks[data.callback];
                                callback(data.data);
                            }
                        }
                    }.bind(this));
                },

                emit: function(evName, data, callback) {
                    var uuid;

                    if (callback) {
                        uuid = guid();
                        this._callbacks[uuid] = callback;
                    }

                    $window.parent.postMessage({
                        type: 'socketEvent',
                        eventName: evName,
                        data: data,
                        callback: uuid
                    }, targetOrigin);
                }
            };


            var BaseSockets = {

                _forwardedEvents: {},

                _initialize: function() {
                    $window.___hasSockets = true;
                    // Forward events
                    sliderPlugins.on('*', function(evName) {
                        var args = [].slice.call(arguments, 1);

                        if (this._forwardedEvents[evName]) {
                            this.emit(evName, args);
                        }
                    }.bind(this));
                },

                forwardEventToServer: function(evName) {
                    this._forwardedEvents[evName] = true;
                }

            };


            // ifowisko
            var Sockets = null;
            if ($window.parent.___hasSockets) {
                Sockets = ForwardingSocket;
            } else {
                Sockets = WebSocket;
            }

            //initialize
            var Socket = _.extend({}, BaseSockets, Sockets);
            BaseSockets._initialize.call(Socket);
            Sockets._initialize.call(Socket);

            return Socket;
        }
    ]);

});