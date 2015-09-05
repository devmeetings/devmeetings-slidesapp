'use strict';

import _ from '_';

import sliderPlugins from 'slider/slider.plugins';
import viewTemplate from './sw-output-devices.html!text';

sliderPlugins.directive('swOutputDevices', () => {
  return {
    restrict: 'E',
    scope: {
      withDevices: '=',
      withoutControls: '=',
      activeDevice: '=',
      width: '=',
      height: '=',
      scale: '=',
      workspaceId: '='
    },
    transclude: true,
    bindToController: true,
    controllerAs: 'model',
    template: viewTemplate,
    controller ($scope, $window) {
      let d = new SwOutputDevices({
        $scope, $window
      });
      d.controller(this);
    }
  };
});

const DEFAULT_SIZES = {
  'phone': {
    width: 375,
    height: 667,
    scale: 1.0
  },
  'tablet': {
    width: 1024,
    height: 768,
    scale: 0.4
  },
  'desktop': {
    width: 1366,
    height: 768,
    scale: 0.3
  }
};

class FreeResizer {

  constructor ($scope, $window, events) {
    this.$scope = $scope;
    this.$window = $window;
    this.onMove = _.throttle(this.onMove.bind(this), 50);
    this.listenToUp = this.listenToUp.bind(this);

    this.onDiffFromStart = events.onDiffFromStart;
  }

  onStartDrag (ev) {
    this.saveCurrentPosition(ev);
    this.$scope.dragActive = true;
    this.$window.addEventListener('mousemove', this.onMove);
    this.$window.addEventListener('mouseup', this.listenToUp);
  }

  getPosition (ev) {
    return {
      x: ev.screenX,
      y: ev.screenY
    };
  }

  saveCurrentPosition (ev) {
    this.startPos = this.getPosition(ev);
  }

  onMove (ev) {
    let position = this.getPosition(ev);
    let diff = {
      x: this.startPos.x - position.x,
      y: this.startPos.y - position.y
    };
    this.$scope.$apply(() => {
      this.onDiffFromStart(diff);
    });
  }

  listenToUp () {
    this.$window.removeEventListener('mousemove', this.onMove);
    this.$window.removeEventListener('mouseup', this.listenToUp);

    this.$scope.$apply(() => {
      this.$scope.dragActive = false;
    });
  }

}

class SwOutputDevices {
  constructor (data) {
    _.extend(this, data);
  }

  controller (vm) {
    this.$scope.$watch(() => vm.withDevices, () => {
      if (!vm.activeDevice) {
        vm.activeDevice = 'phone';
      }
    });

    this.$scope.$watch(() => vm.activeDevice, () => {
      let sizes = DEFAULT_SIZES[vm.activeDevice];
      this.applySize(vm, sizes);
    });

    this.applySize(vm, DEFAULT_SIZES.phone);

    vm.getWrapperClass = () => {
      if (!vm.withDevices) {
        return {};
      }
      var x = {};
      x['with-' + vm.activeDevice] = true;
      return x;
    };

    vm.getContainerStyles = () => {
      if (!vm.withDevices) {
        return {
          width: '100%',
          height: '100%'
        };
      }
      return {
        width: vm.width,
        height: vm.height,
        transform: `scale(${vm.scale})`
      };
    };

    let savedPosition = null;
    let vResizer = new FreeResizer(this.$scope, this.$window, {
      onDiffFromStart: (diff) => {
        vm.height = Math.max(
          10,
          savedPosition - Math.round(diff.y / vm.scale)
        );
      }
    });
    vm.onVResize = (ev) => {
      savedPosition = vm.height;
      vResizer.onStartDrag(ev);
    };
    let hResizer = new FreeResizer(this.$scope, this.$window, {
      onDiffFromStart: (diff) => {
        vm.width = Math.max(
          10,
          savedPosition - Math.round(diff.x / vm.scale)
        );
      }
    });
    vm.onHResize = (ev) => {
      savedPosition = vm.width;
      hResizer.onStartDrag(ev);
    };
  }

  applySize (vm, size) {
    vm.width = size.width;
    vm.height = size.height;
    vm.scale = size.scale;
  }
}
