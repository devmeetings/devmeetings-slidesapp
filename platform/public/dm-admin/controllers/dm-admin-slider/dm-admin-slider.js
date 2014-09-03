define(['module',
    'angular',
    '_',
    'dm-admin/dm-admin-app'
], function(module, angular, _, adminApp) {
    adminApp.controller('dmAdminSlider', ['$scope',
        function($scope) {
            $scope.options = [{
                title: 'Trainings',
                sref: 'index.trainings'
            }, {
                title: 'Decks',
                sref: 'index.decks'
            }, {
                title: 'Wavesurfer',
                sref: 'index.waves'
            }, {
                title: 'Upload',
                sref: 'index.upload'
            }];
        }
    ]);
});