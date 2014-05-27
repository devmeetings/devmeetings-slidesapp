define(['module', 'slider/slider.plugins'], function(module, sliderPlugins) {
    var path = sliderPlugins.extractPath(module);

    var getLink = function(pwywData) {
        try {
            var d = JSON.parse(pwywData);
            return d.q;
        } catch (e) {
            return false;
        }
    };

    // Code from http://stackoverflow.com/questions/2820249/base64-encoding-and-decoding-in-client-side-javascript
    /* jshint ignore:start */
    var decodeBase64 = function(s) {
        var e = {}, i, b = 0,
            c, x, l = 0,
            a, r = '',
            w = String.fromCharCode,
            L = s.length;
        var A = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
        for (i = 0; i < 64; i++) {
            e[A.charAt(i)] = i;
        }
        for (x = 0; x < L; x++) {
            c = e[s.charAt(x)];
            b = (b << 6) + c;
            l += 6;
            while (l >= 8) {
                ((a = (b >>> (l -= 8)) & 0xff) || (x < (L - 2))) && (r += w(a));
            }
        }
        return r;
    };
    /* jshint ignore:end */


    sliderPlugins.registerPlugin('slide', 'pwyw', 'slide-pwyw').directive('slidePwyw', [
        '$window',
        function($window) {
            return {
                restrict: 'E',
                scope: {
                    data: '=data',
                    slide: '=context'
                },
                templateUrl: path + '/slide-pwyw.html',
                link: function(scope, element) {
                    scope.urlEncoded = "";

                    var url = getLink($window.sessionStorage['slider-pwyw']);
                    if (url) {
                        scope.fromUrl = true;
                        scope.urlEncoded = url;
                    }

                    scope.$watch('urlEncoded', function(val) {
                        if (val) {
                            scope.url = decodeBase64(val);
                        }
                    });
                }
            };
        }
    ]);

});