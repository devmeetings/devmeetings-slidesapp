define(['angular', 'xplatform/xplatform-app'], function (angular, xplatformApp) {
    xplatformApp.service('dmEvents', ['$http', '$q', function ($http, $q) {
   
        var promises = {
        };
        
        var states = {
        };


        /*
         * title: String,
         * visible: Boolean,
         * audios: Array,
         * recording: String    (mongod._id)
         */
        var TransformedEvent = function (options) {
            this.title = options.title;
            this.visible = options.visible;
            this.audios = options.audios;
            this.todos = options.todos;
            this.chapters = options.chapters;
        };

        TransformedEvent.prototype.constructor = TransformedEvent;

        var transform = function (data) {
            return new TransformedEvent({
                title: data.title,  
                visible: data.visible,
                audios: data.audios,
                todos: data.todos,
                chapters: data.chapters
            });
        };
    
        return {
            allEvents: function () {
                var result = $q.defer();
                $http.get('/api/events').then(function (data) {
                    result.resolve(data.data);
                }, function () {
                    result.reject();
                });

                return result.promise;
            },
            getEvent: function (event, download) {
                var result = promises[event];

                if (!result || download) {
                    result = $q.defer();
                    promises[event] = result;
                }

                if (!download) {
                    return result.promise;
                }

                $http.get('/api/events/' + event).then(function (data) {
                    result.resolve(transform(data.data));
                }, function () {
                    result.reject();
                });

                return result.promise;
            },
            getState: function (event, index) {
                var key = event + 'index' + index;
                if (!states[key]) {
                    states[key] = {};
                }
                return states[key];
            },
            changeEventVisibility: function (event, visible) {
                $http.post('/api/change_event_visibility/' + event + '/' + visible);
            }
        };
    }]);
});

