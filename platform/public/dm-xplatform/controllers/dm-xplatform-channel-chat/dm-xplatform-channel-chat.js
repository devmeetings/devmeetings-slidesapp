define(['angular', 'xplatform/xplatform-app', '_'], function (angular, xplatformApp) {

    xplatformApp.controller('dmXplatformChannelChat', ['$scope', 'codeShareService', 'dmUser', function ($scope, codeShareService, dmUser) {

        $scope.posts = [];

        $scope.message = {
            text: ''
        };

        dmUser.getCurrentUser().then(function (data) {
            $scope.user = data.result;
        });

        codeShareService.registerCurrentWorkspaceCallback(function (channel){
            $scope.channel = channel;
            $scope.posts = [];
            $scope.message = {
                text: ''
            };
        });

        codeShareService.registerNewPostsCallback(function (posts, inFront){
            $scope.posts = inFront ? posts.concat($scope.posts): $scope.posts.concat(posts);
        });

        $scope.sendMsg = function () {
          codeShareService.sendChatMsg($scope.user, $scope.message.text);
          $scope.message.text = '';
        };

    }]);

});
