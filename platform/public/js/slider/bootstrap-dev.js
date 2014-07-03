define(['angular', 'slider/slider.plugins'], function(angular, sliderPlugins) {

    return function(module) {
        module = module || 'slider';
        require(['require/plugins/paths'], function(plugins) {
            require(plugins, function() {

                angular.bootstrap(document, [module]);

                // TODO shitty
                setTimeout(function() {
                    sliderPlugins.trigger('load');
                }, 200);

            });
        });
    };
});
