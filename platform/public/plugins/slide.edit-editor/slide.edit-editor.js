define(["_", "ace", 'slider/slider.plugins'], function(_, ace, sliderPlugins) {

    sliderPlugins.registerPlugin('slide.edit', '*', 'slideedit-editor', 0).directive('slideeditEditor', ['$rootScope', "$window", "$http",
        function($rootScope, $window, $http) {
            return {
                restrict: 'E',
                scope: {
                    slide: '=context'
                },
                /*
                .live-edit(ng-controller="SliderEditCtrl", ng-class="{ 'collapsed' : collapsed }")
                    button.btn.btn-primary.btn-block.btn-xs(ng-click="collapsed = !collapsed") 
                      span(ng-show="collapsed") show
                      span(ng-show="!collapsed") hide
                    yaml-editor(deck="deck")
                */
                template: '<div class="editor editor-live"></div>',
                link: function(scope, element) {
                    var editor = ace.edit(element.find('.editor')[0]);
                    editor.setTheme('ace/theme/todr');
                    editor.getSession().setMode('ace/mode/json');
                    editor.setValue(JSON.stringify(scope.slide, null, 2));
                    var x = function() {
                        var value = editor.getValue();
                        scope.$apply(function() {
                            scope.slide = JSON.parse(value);
                            $rootScope.$broadcast('slide', scope.slide);
                        });
                    };
                    editor.on('change', _.throttle(x, 100));
                }
            };
        }
    ]);

});