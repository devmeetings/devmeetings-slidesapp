define(['angular', 'xplatform/xplatform-app', '_'], function (angular, xplatformApp) {

    xplatformApp.controller('dmXplatformChannelChat', ['$scope', 'codeShareService', function ($scope, codeShareService) {

        $scope.posts = [];

        $scope.message = {
            text: ''
        };

        codeShareService.registerNewPostsCallback(function (posts){
            $scope.posts = posts;
        });

        $scope.sendMsg = function () {
          codeShareService.sendChatMsg($scope.message.text);
        };

    }]);

});
