define(['slider/slider.plugins'], function (sliderPlugins) {
    sliderPlugins.factory('RecordingsPlayerFactory', ['$timeout',
        function ($timeout) {
            var RecordingsPlayerFactory = function (recording, callback) {
                var currentTime = 0;
                var currentSnap = 0;
                var run = false;
               
                var getCode = function (index) {
                    return recording.slides[index].code;
                };

                var getTime = function (index) {
                    return recording.slides[index].timestamp;
                };

                var nextSnap = function next() {
                    if (run) {
                        if (currentSnap > recording.slides.length - 2){
                            callback(getCode(currentSnap));
                            run = false;
                            return;
                        }
                        
                        var time = getTime(++currentSnap);
        
                        $timeout(next, time - currentTime);
                        currentTime = time;
                        callback(getCode(currentSnap));
                    } else {
                        run = false;
                    }
                };

                return {
                    play: function () {
                        run = true;
                        nextSnap();
                    },
                    pause: function () {
                        run = false;
                    }
                };
            };


            return RecordingsPlayerFactory;
        }
    ]);
});
