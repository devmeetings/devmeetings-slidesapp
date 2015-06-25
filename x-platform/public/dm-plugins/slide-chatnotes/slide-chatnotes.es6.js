/* jshint esnext:true,-W097 */
'use strict';

import sliderPlugins from 'slider/slider.plugins';
import _ from '_';
import viewTemplate from './slide-chatnotes.html!text';

class ChatNotes {

  constructor (data) {
    _.extend(this, data);
  }

  controller (vm) {
    vm.addNote = () => {
      vm.notes.notes.push(vm.notes.current);
      vm.notes.current = '';
    };

    vm.getLimitThreshold = () => this.getLimitThreshold();
    vm.getCurrentLimit = (isShowingAll) => this.getCurrentLimit(isShowingAll);
  }

  getLimitThreshold () {
    return 5;
  }

  getCurrentLimit (isShowingAll) {
    if (isShowingAll) {
      return Infinity;
    }
    return -this.getLimitThreshold();
  }

}

sliderPlugins
  .registerPlugin('slide.sidebar', 'chatnotes', 'slide-chatnotes', {
    order: 3850,
    name: 'Chat Notes',
    description: 'Notes that looks like chat.',
    example: {
      meta: {
        notes: [{
          type: 'string'
        }],
        current: {
          type: 'string'
        }
      },
      example: {
        notes: [
          'My First Note',
          'My Second Note'
        ],
        current: 'Writin'
      }
    }
  })
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
      template: viewTemplate,
      controller ($scope) {
        let sw = new ChatNotes({
        $rootScope, $scope, $timeout});
        sw.controller(this);
      }
    };
  });
