define(['slider/slider.plugins'], function(sliderPlugins) {

    sliderPlugins.factory('Timer', function($timeout) {

        var Timer = function(durationInMinutes) {
            var duration = durationInMinutes * 60 * 1000;

            this.timeLeft = duration;
            this.duration = duration;

            this._ticker();
        };

        Timer.prototype = {

            isRunning: false,
            startTime: null,
            endTime: null,
            duration: null,
            timeLeft: null,

            start: function() {
                this.isRunning = true;
            },

            stop: function() {
                this.isRunning = false;
            },

            _ticker: function self() {
                if (this.isRunning) {
                    this.timeLeft = this.endTime.getTime() - (new Date()).getTime();
                } else {
                    this.startTime = new Date();
                    this.endTime = new Date(this.startTime.getTime() + this.duration);
                }

                if (this.timeLeft < 0) {
                    this.isRunning = false;
                }

                $timeout(self.bind(this), 250);
            }

        };

        return Timer;
    });
});