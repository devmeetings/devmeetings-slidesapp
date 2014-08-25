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

    var injectDataToHtmlCode = function(htmlCode, jsCode, cssCode) {

        var replaceOrAppend = function(htmlCode, tag, code) {
            if (htmlCode.search(tag)) {
                return htmlCode.replace(tag, code + tag);
            }
            return htmlCode + code;
        };

        htmlCode = replaceOrAppend(htmlCode, '</body>', jsCode);
        htmlCode = replaceOrAppend(htmlCode, '</head>', cssCode);

        return htmlCode;
    };


    sliderPlugins.directive('slideFiddleOutput', ['$location', '$timeout', 'Sockets',

        function($location, $timeout, Sockets) {

            var host = "http://" + $location.host() + ":" + $location.port();

            var commonCss = [
                '<link href="' + host + '/static/css/bootstrap-cyborg.css" rel="stylesheet">'
            ].join("\n");
            var commonJs = [
                '<script src="https://code.jquery.com/jquery.js"></script>'
            ].join("\n");

            var serverPort = 0;
            Sockets.on('serverRunner.code.result', function(data) {
                serverPort = data.port || 0;
            });

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
                            var contentWindow = $iframe[0].contentWindow;
                            sliderPlugins.trigger('slide.slide-fiddle.output', contentWindow.document, contentWindow);
                        } catch (e) {
                            // Just swallow exceptions about CORS
                        }
                    }, 500));

                    var refreshPage = function() {
                        $iframe[0].src = "" + $iframe[0].src;
                    };
                    sliderPlugins.listen(scope, 'slide.serverRunner.code.run', refreshPage);

                    var getHash = function() {
                        if (scope.fiddle.url) {
                            return scope.fiddle.url.hash;
                        }
                        return '';
                    };

                    var refreshFiddle = function(fiddle) {
                        if (fiddle.url && fiddle.url.address) {
                            return;
                        }

                        var isPure = false;
                        var wrapWithForwarder = function(code) {
                            return 'try { ' + code + ';window.parent.postMessage({type:"fiddle-error", msg: ""}, "' + host + '");}' +
                                'catch (e) { console.error(e); window.parent.postMessage({type: "fiddle-error", msg: e.message}, "' + host + '"); }';
                        };
                        var fiddleJsCode = "window.port = " + serverPort + ";" + fiddle.js;
                        var jsCode = (isPure ? '' : commonJs) + "<script>" + wrapWithForwarder(fixOneLineComments(fiddleJsCode)) + "</script>";
                        var cssCode = (isPure ? '' : commonCss) + "<style>" + fixOneLineComments(fiddle.css) + "</style>";
                        var htmlCode = injectDataToHtmlCode(fiddle.html, jsCode, cssCode);


                        $iframe.removeClass('fiddle-pure');
                        $iframe[0].src = "/api/static?p=" + btoa(htmlCode) + '#' + getHash();
                    };

                    sliderPlugins.listen(scope, 'slide.slide-fiddle.change', _.throttle(function(fiddle) {
                        refreshFiddle(fiddle);
                    }, EXECUTION_DELAY, {
                        leading: false,
                        trailing: true
                    }));


                    // URL support
                    scope.$watch('fiddle.url.hash', function() {
                        if (!scope.fiddle.url) {
                            return;
                        }
                        $iframe[0].contentWindow.location.hash = scope.fiddle.url.hash;
                    });

                    scope.$watch('fiddle.url.address', function(newVal, oldVal) {
                        if (!scope.fiddle.url) {
                            return;
                        }
                        $iframe.addClass('fiddle-pure');
                        $iframe[0].src = scope.fiddle.url.address;
                    });

                    scope.updateAddress = _.debounce(function() {
                        var address = scope.fiddle.url.addressTemp.replace(':port', ':' + serverPort);
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

                        var parseAddress = function(url, address) {
                            if (address.indexOf('index.html') === 0) {
                                var arr = address.split('#');
                                url.hash = arr[1] || '';
                            } else if (address.indexOf('/') === 0) {
                                url.hash = address;
                            } else {
                                url.address = address;
                            }
                        };

                        parseAddress(url, address);


                        scope.$apply(function() {
                            _.extend(scope.fiddle.url, url);
                            refreshFiddle(scope.fiddle);
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