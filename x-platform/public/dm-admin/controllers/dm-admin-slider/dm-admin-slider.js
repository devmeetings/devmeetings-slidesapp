define(['module',
    'angular',
    '_',
    'dm-admin/dm-admin-app'
], function(module, angular, _, adminApp) {
    adminApp.controller('dmAdminSlider', ['$scope',
        function($scope) {
            $scope.options = [{
                title: 'Decks',
                sref: 'index.decks'
            }, {
                title: 'Wavesurfer',
                sref: 'index.waves'
            }, {
                title: 'Quiz',
                sref: 'index.quiz'
            }];
        }
    ]);
});
