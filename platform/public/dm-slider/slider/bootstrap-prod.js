define(['angular', 'slider/slider.plugins'], function(angular, sliderPlugins) {

    return function() {

        require("<plugins>", function() {

            angular.bootstrap(document, ["slider"]);

            // TODO shitty
            setTimeout(function() {
                sliderPlugins.trigger('load');
            }, 200);

        });

    };
});