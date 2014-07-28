define(['_', 'slider/slider.plugins'], function(_, sliderPlugins) {
    sliderPlugins.factory('RecordingsPlayerFactory', ['$timeout',
        function($timeout) {
            var RecordingsPlayerFactory = function(recording, callback) {
                var currentTime = 0;
                var currentSnapIdx = 0;
                var run = false;

                var getCode = function(index) {
                    return recording.slides[index].code;
                };

                var getTime = function(index) {
                    return recording.slides[index].timestamp;
                };

                var nextSnap = function next() {
                    if (run) {
                        if (currentSnapIdx > recording.slides.length - 2) {
                            callback(getCode(currentSnapIdx));
                            run = false;
                            return;
                        }

                        var time = getTime(++currentSnapIdx);

                        $timeout(next, time - currentTime);
                        currentTime = time;
                        callback(getCode(currentSnapIdx));
                    }
                };

                return {
                    play: function() {
                        run = true;
                        nextSnap();
                    },
                    pause: function() {
                        run = false;
                    },
                    length: function() {
                        var last = _.last(recording.slides);
                        return last ? last.timestamp / 1000 : 0;
                    },
                    goToSecond: function(second) {
                        var millisecond = second * 1000;
                        var index = _.findIndex(recording.slides, function(slide) {
                            return slide.timestamp > millisecond;
                        });
                        if (index === -1) {
                            return;
                        }

                        if (index > 0) {
                            index -= 1;
                        }
                        currentTime = getTime(index);
                        currentSnapIdx = index;
                        callback(getCode(index));
                    }
                };
            };


            return RecordingsPlayerFactory;
        }
    ]);
});