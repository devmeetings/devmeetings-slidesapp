define(['module', '_', 'slider/slider.plugins', 'ace', 'ace_languageTools'], function(module, _, sliderPlugins, ace) {
    'use strict';

    var path = sliderPlugins.extractPath(module);

    function convertName(name) {
        var sw = {
            'html': 'index|html',
            'js': 'main|js',
            'css': 'styles|css',
        };
        return sw[name];
    }
    function getActive(fiddle) {
        if (!fiddle[fiddle.active]) {
          return convertName('html');  
        }
        return convertName(fiddle.active);
    }

    function convertTabs(fiddle) {
        var tabs = {};
        var files = ['html', 'css', 'js'];
        var editor = fiddle.aceOptions;

        files.map(function(f){
            if (!fiddle[f]) {
                return;
            }
            var name = convertName(f);
            tabs[name] = {
                content: fiddle[f],
                editor: editor
            };
        });

        [{
            search: 'css',
            from: '</head>',
            to: '<link rel="stylesheet" src="style.css"></head>'
        }, {
            search: 'js',
            from: '</body>',
            to: '<script src="main.js"></script></body>'
        }].map(function(f) {
            if (!fiddle[f.search]) {
                return;
            }
            var content = tabs['index|html'].content;
            tabs['index|html'].content = content.replace(f.from, f.to);
        });

        return tabs;
    }

    sliderPlugins.registerPlugin('slide', 'fiddle', 'slide-fiddle', 3900).directive('slideFiddle', [
        '$timeout', '$window', '$rootScope',
        function($timeout, $window, $rootScope) {
            return {
                restrict: 'E',
                scope: {
                    fiddle: '=data',
                    slide: '=context',
                    mode: '='
                },
                templateUrl: path + '/fiddle.html',
                link: function(scope, element) {
                    if (!scope.fiddle) {
                        return;
                    }

                    //convert fiddle into workspace
                    scope.slide.workspace = {
                        active: getActive(scope.fiddle),
                        tabs: convertTabs(scope.fiddle),
                        size: scope.fiddle.size
                    };


                    scope.$watch('fiddle.active', function(){
                        scope.slide.workspace.active = getActive(scope.fiddle.active);   
                    });

                    scope.$watch('fiddle.aceOptions', function(){
                        var ws = scope.slide.workspace;
                        if (ws[ws.active]) {
                            ws[ws.active].editor = scope.fiddle.aceOptions;
                        }
                    });

                    ['html', 'css', 'js'].map(function(x){
                        scope.$watch('fiddle.'+x, function(){
                            scope.slide.workspace.tabs = convertTabs(scope.fiddle);
                            scope.fiddle.active = x;
                            // If something's happens there it should be active (not sure if needed)
                            scope.slide.workspace.active = getActive(scope.fiddle);
                        });
                    });
                }
            };
        }
    ]);

});
