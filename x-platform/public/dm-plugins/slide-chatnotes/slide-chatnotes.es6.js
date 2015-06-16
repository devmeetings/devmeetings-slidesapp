/* jshint esnext:true,-W097 */
'use strict';

import sliderPlugins from 'slider/slider.plugins';
import * as _ from '_';

class ChatNotes {

  constructor(data) {
    _.extend(this, data);
  }

  controller(vm) {
    vm.addNote = () => {
      vm.notes.notes.push(vm.notes.current);
      vm.notes.current = '';
    };

    vm.getLimitThreshold = () => this.getLimitThreshold();
    vm.getCurrentLimit = (isShowingAll) => this.getCurrentLimit(isShowingAll);
  }

  getLimitThreshold() {
    return 5;
  }

  getCurrentLimit(isShowingAll) {
    if (isShowingAll) {
      return Infinity;
    }
    return -this.getLimitThreshold();
  }

}

  sliderPlugins
  .registerPlugin('slide.sidebar', 'chatnotes', 'slide-chatnotes', 3850)
  .directive('slideChatnotes', ($rootScope, $timeout) => {
    return {
      restrict: 'E',
      scope: {
        notes: '=data',
        slides: '=context',
        mode: '='
      },
      bindToController: true,
      controllerAs: 'model',
      templateUrl: '/static/dm-plugins/slide-chatnotes/slide-chatnotes.html',
      controller($scope) {
        let sw = new ChatNotes({
            $rootScope, $scope, $timeout
        });
        sw.controller(this);
      }
    };
  });
