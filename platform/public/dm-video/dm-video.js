'use strict';
angular.module('dm-video', []).directive('dmVideo', ['$timeout',
    function () {
        return {
            restrict: 'E',
            scope: {
                dmSrc: '=',
                dmCurrentSecond: '=',
                dmIsPlaying: '=',
                dmVideoLength: '=',
                dmControls: '@',
                dmHeight: '@',
                delay: '='
            },
            template: '<div><video class="video-js vjs-default-skin" preload="auto" width="100%" autoplay="autoplay">'
            + '</video></div>',
            link: function (scope, element) {
                var $video = element.find('video')[0];
                if (scope.dmControls) {
                    $video.setAttribute('controls', true);
                }
                
                $video.setAttribute('height', scope.dmHeight);
                
                videojs($video, {
                    techOrder: ['youtube', 'html5'],
                    quality: '720p',
                    src: scope.dmSrc
                });
            }
        }
    }
]);
