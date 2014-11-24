define(['angular'], function (angular) {
    'use strict';

    angular.module('dm-teamspeak', []).directive('dmTeamspeak', ['Sockets',
        function (Sockets) {
            return {
                restrict: 'E',
                templateUrl: '/static/dm-modules/dm-teamspeak/dm-teamspeak.html',
                link: function (scope, element, attrs) {

                    scope.channelList = [{cid:0, name:'Loading...'}];

                    Sockets.emit('teamspeak.init');

                    Sockets.on('teamspeak.channelList', function(channelList) {
                        scope.channelList = channelList;
                        scope.$apply();
                    });


                }
            }
        }
    ]);

});
