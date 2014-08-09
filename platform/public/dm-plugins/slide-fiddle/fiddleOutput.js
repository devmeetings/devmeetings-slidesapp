define(['module', '_', 'slider/slider.plugins'], function(module, _, sliderPlugins, ace) {
    'use strict';

    var EXECUTION_DELAY = 2000;
    var path = sliderPlugins.extractPath(module);

    var fixOneLineComments = function(code) {
        return code.replace(/(.*)\/\/(.*)/g, function(match, reg1, reg2) {
            // but don't break links! - This is shitty as fuck!
            if (/.*http[s]?\:$/.test(reg1)) {
                return match;
            }
            return '/* ' + reg2 + ' */';
        });
    };


    sliderPlugins.directive('slideFiddleOutput', ['$location', '$timeout',

        function($location, $timeout) {

            var host = "http://" + $location.host() + ":" + $location.port();

            var commonCss = [
                '<link href="' + host + '/static/css/bootstrap-cyborg.css" rel="stylesheet">'
            ].join("\n");
            var commonJs = [
                '<script src="https://code.jquery.com/jquery.js"></script>'
            ].join("\n");

            return {
                restrict: 'E',
                scope: {
                    fiddle: '=data'
                },
                templateUrl: path + '/fiddleOutput.html',
                link: function(scope, element) {
                    var $iframe = element.find('iframe');
                    $iframe.on('load', _.debounce(function() {
                        try {
                            sliderPlugins.trigger('slide.slide-fiddle.output', $iframe[0].contentWindow.document);
                        } catch(e) {
                            // Just swallow exceptions about CORS
                        }
                    }, 500));

                    var getHash = function() {
                        if (scope.fiddle.url) {
                            return scope.fiddle.url.hash;
                        }
                        return '';
                    };

                    sliderPlugins.listen(scope, 'slide.slide-fiddle.change', _.throttle(function(fiddle) {
                        if (fiddle.url && fiddle.url.address) {
                            return;
                        }

                        var isPure = false;
                        var wrapWithForwarder = function(code) {
                            return 'try { ' + code + ';window.parent.postMessage({type:"fiddle-error", msg: ""}, "' + host + '");}' +
                                'catch (e) { console.error(e); window.parent.postMessage({type: "fiddle-error", msg: e.message}, "' + host + '"); }';
                        };
                        var jsCode = (isPure ? '' : commonJs) + "<script>" + wrapWithForwarder(fixOneLineComments(fiddle.js)) + "</script>";
                        var cssCode = (isPure ? '' : commonCss) + "<style>" + fixOneLineComments(fiddle.css) + "</style>";
                        var htmlCode = fiddle.html;


                        if (htmlCode.search("</body>")) {
                            htmlCode = htmlCode.replace("</body>", jsCode + "</body>");
                        } else {
                            htmlCode += jsCode;
                        }
                        if (htmlCode.search("</head>")) {
                            htmlCode = htmlCode.replace("</head>", cssCode + "</head>");
                        } else {
                            htmlCode = cssCode + htmlCode;
                        }

                        $iframe.removeClass('fiddle-pure');
                        $iframe[0].src = "/api/static?p=" + btoa(htmlCode) + '#' + getHash();
                    }, EXECUTION_DELAY, {
                        leading: false,
                        trailing: true
                    }));


                    // URL support
                    scope.$watch('fiddle.url.hash', function(){
                        $iframe[0].contentWindow.location.hash = scope.fiddle.url.hash;
                    });

                    scope.$watch('fiddle.url.address', function(){
                        $iframe.addClass('fiddle-pure');
                        $iframe[0].src = scope.fiddle.url.address;
                    });

                    scope.updateAddress = _.debounce(function(){
                        var address = scope.fiddle.url.addressTemp;
                        scope.lastAddressTemp = address;
                        // /costam
                        // index.html#/costam
                        // http://google.pl
                        if (!address) {
                            return;
                        }

                        var url = {
                            address: null,
                            hash: ''
                        };

                        if (address.indexOf('index.html') === 0) {
                            var arr = address.split('#');
                            url.hash = arr[1] || '';
                        } else if (address.indexOf('/') === 0) {
                            url.hash = address;
                        } else {
                            url.address = address;
                        }
                        scope.$apply(function(){
                            _.extend(scope.fiddle.url, url);
                        });
                    }, 500);

                    var updatingUrl = true;
                    scope.$watch('fiddle.url', function(val) {
                        if (!val) {
                            updatingUrl = false;
                            return;
                        }
                        scope.lastAddressTemp = scope.fiddle.url.addressTemp;
                        updatingUrl = true;
                        (function updateUrl() {

                            if (!scope.fiddle.url.address && scope.fiddle.url.addressTemp === scope.lastAddressTemp) {
                                var hash = $iframe[0].contentWindow.location.hash.toString().replace('#', '');
                                scope.fiddle.url.hash = hash;
                                scope.fiddle.url.addressTemp = 'index.html#' + hash;
                            }

                            if (updatingUrl) {
                                $timeout(updateUrl, 600);  
                            }
                        }());
                    });
                }
            };
        }
    ]);

});
