define(['module', 'slider/slider.plugins'], function(module, sliderPlugins) {
    var path = sliderPlugins.extractPath(module);

    // Fucking awful
    var parseUrl = function(query) {
        var parts = query.replace(/^\?/, '').split('&');

        var queryParams = parts.reduce(function(memo, part) {
            var vals = part.split('=');
            memo[vals[0]] = decodeURIComponent(vals[1]);
            return memo;
        }, {});

        return queryParams;
    };

    sliderPlugins.registerPlugin('deck', 'pwyw', 'deck-pwyw').directive('deckPwyw', [
        '$window',
        function($window) {

            var url = parseUrl($window.location.search);

            return {
                restrict: 'E',
                scope: {
                    data: '=data',
                    slide: '=context'
                },
                template: '<div></div>',
                link: function(scope, element) {
                    if (url.q) {
                        $window.sessionStorage['slider-pwyw'] = JSON.stringify({
                            time: new Date(),
                            q: url.q
                        });
                    }
                }
            };
        }
    ]);

});