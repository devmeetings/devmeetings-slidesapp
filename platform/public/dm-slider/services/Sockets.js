define(['_', 'slider/slider.plugins', 'socket.io', 'asEvented', 'utils/guid', 'services/DeckAndSlides'], function(_, sliderPlugins, io, asEvented, guid) {

    var CreateWebSocket = function(targetOrigin, $window, $location, deckId) {
        var WebSocket = {

            _socket: null,

            _initialize: function() {
                this._socket = io.connect('http://' + $location.host() + "/?deck=" + deckId);
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
        return WebSocket;
    };

    var CreateForwardingSocket = function(targetOrigin, $window) {
        var ForwardingSocket = {
            _callbacks: {},

            _eventListeners: {
                'socketEvent': function(data) {
                    this.trigger(data.eventName, data.data);
                },
                'socketCallback': function(data) {
                    var cb = this._callbacks[data.callback];

                    if (cb) {
                        delete this._callbacks[data.callback];
                        cb(data.data);
                    }
                }
            },

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

                    var listener = this._eventListeners[data.type];
                    if (listener) {
                        listener.call(this, data);
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
        return ForwardingSocket;
    };

    var CreateBaseSocket = function($window) {
        var BaseSocket = {
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
        return BaseSocket;
    };

    sliderPlugins.factory('Sockets', ['$location', '$window', 'DeckAndSlides',
        function($location, $window, DeckAndSlides) {
            var targetOrigin = $window.location;

            // ifowisko
            var Sockets = null;
            if ($window.parent.___hasSockets) {
                Sockets = CreateForwardingSocket(targetOrigin, $window);
            } else {
                Sockets = CreateWebSocket(targetOrigin, $window, $location, DeckAndSlides.deckId);
            }

            //initialize
            var BaseSockets = CreateBaseSocket($window);
            var Socket = _.extend({}, BaseSockets, Sockets);
            BaseSockets._initialize.call(Socket);
            Sockets._initialize.call(Socket);

            return Socket;
        }
    ]);

});