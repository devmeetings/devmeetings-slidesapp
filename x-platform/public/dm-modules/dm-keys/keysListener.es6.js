/* jshint esnext:true,-W097 */
'use strict';

export default function ($scope) {
  return function (event) {
    if (event.target.type === 'textarea' || event.target.type === 'text') {
      return;
    }

    var state = $scope.state;
    var pressed = event.keyCode;
    var VK_SPACE = 32;
    var VK_NEXT = 39;
    var VK_PREV = 37;

    if (pressed === VK_SPACE) {
      state.isPlaying = !state.isPlaying;
      return;
    }
    if (pressed === VK_NEXT && state.nextPlayTo) {
      state.currentSecond = state.nextPlayTo;
      return;
    }
    if (pressed === VK_PREV && state.playFrom) {
      state.currentSecond = state.playFrom;
      return;
    }
  };
}
