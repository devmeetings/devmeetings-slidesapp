define(['angular', 'xplatform/xplatform-app'], function (angular, xplatformApp) {
    xplatformApp.service('dmEvents', ['$http', '$q', function ($http, $q) {
   
        var promises = {
        };
        
        var states = {
        };


        /*
         * title: String,
         * visible: Boolean,
         * audio: String,   (url)
         * recording: String    (mongod._id)
         */
        var TransformedEvent = function (options) {
            this.title = options.title;
            this.visible = options.visible;
            this.audio = options.audio;
            this.recording = options.recording;
        };

        TransformedEvent.prototype.constructor = TransformedEvent;

        var transform = function (data) {
            return new TransformedEvent({
                title: data.title,  
                visible: data.visible,
                audio: data.trainingId.chapters.length > 0 ? data.trainingId.chapters[0].videodata.url : '',
                recording: data.trainingId.chapters.length > 0 ? data.trainingId.chapters[0].videodata.recording : ''
            });
        };
    
        return {
            getEvent: function (event, download) {
                var result = promises[event];

                if (!result || download) {
                    result = $q.defer();
                    promises[event] = result;
                }

                if (!download) {
                    return result.promise;
                }

                $http.get('/api/event/' + event).then(function (data) {
                    result.resolve(transform(data.data));
                }, function () {
                    result.reject();
                });

                return result.promise;
            },
            getState: function (event) {
                if (!states[event]) {
                    states[event] = {};
                }
                return states[event];
            }
        };
    }]);
});

