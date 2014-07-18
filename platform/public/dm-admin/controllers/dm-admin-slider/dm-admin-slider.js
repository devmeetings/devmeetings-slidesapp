define(['module',
        'angular',
        '_',
        'dm-admin/dm-admin-app'
], function (module, angular, _, adminApp) {    
    adminApp.controller('dmAdminSlider', ['$scope',
        function ($scope) {
            $scope.options = [{
                title: 'Player',
                sref: 'index.player'
            },{
                title: 'Decks',
                sref: 'index.decks'
            }];
        }
    ]);
});
