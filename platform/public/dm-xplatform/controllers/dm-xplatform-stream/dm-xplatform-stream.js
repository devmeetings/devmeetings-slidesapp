define(['angular', 'xplatform/xplatform-app'], function (angular, xplatformApp) {
    xplatformApp.controller('dmXplatformStream', ['$scope', '$stateParams', 'dmStream', function ($scope, $stateParams, dmStream) {
        if ($stateParams.id) {
            dmStream.getUserStream($stateParams.id).then(function (data) {
                $scope.stream = data;
            });
        } else {
            dmStream.getStream().then(function (data) {
                $scope.stream = data;
            });
        }

        var details = {
            'event.signup' : {
                text: 'weźmie udział w szkoleniu'
            },
            'deck.start' : {
                text: 'rozpoczął kurs'
            },
            'deck.finish' : {
                text: 'zakończył kurs'
            },
            'slide.enter' : {
                text: 'rozpoczął rozwiązywanie rozwiazywanie zadań na slajdzie'
            },
            'video.enter' : {
                text: 'video ogląda szkolenie video'
            },
            'microtask.done' : {
                text: 'ukończył microzadanie'
            }
        };

        $scope.detailsForActivity = function (activity) {
            var det = details[activity.type];
            det.title = activity.data.title; 
            return det;
        };

    }]);
});
