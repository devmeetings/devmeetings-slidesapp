define(['angular', 'slider/slider'], function(angular, slider) {

    var images = {
        task: {
            image: 'fa-star',
            color: 'rgb(254,251,0)'
        },
        taskDone: {
            image: 'fa-check',
            color: 'rgb(57,179,74)'
        },
        snippet: {
            image: 'fa-file-text',
            color: '#5aabcb'
        }
    };

    slider.directive('dmTaskicon', [

        function() {
            return {
                restrict: 'E',
                scope: {
                    type: '='
                },
                replace: 'true',
                templateUrl: '/static/dm-xplatform/directives/dm-taskicon/dm-taskicon.html',
                link: function(scope, element, attr) {
                    scope.images = images;
                }
            };
        }
    ]);
});