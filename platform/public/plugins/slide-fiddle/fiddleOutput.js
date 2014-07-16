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


    sliderPlugins.directive('slideFiddleOutput', ['$location',

        function($location) {

            var host = "http://" + $location.host() + ":" + $location.port();

            var commonCss = [
                '<link href="' + host + '/static/css/bootstrap-cyborg.css" rel="stylesheet">'
            ].join("\n");
            var commonJs = [
                '<script src="https://code.jquery.com/jquery.js"></script>'
            ].join("\n");

            return {
                restrict: 'E',
                scope: {},
                templateUrl: path + '/fiddleOutput.html',
                link: function(scope, element) {
                    sliderPlugins.listen(scope, 'slide.slide-fiddle.change', _.throttle(function(fiddle) {
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

                        element.find('iframe')[0].src = "/api/static?p=" + btoa(htmlCode);


                    }, EXECUTION_DELAY));
                }
            };
        }
    ]);

});
