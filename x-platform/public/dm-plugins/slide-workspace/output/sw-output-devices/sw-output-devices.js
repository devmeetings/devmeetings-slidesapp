'use strict';

import _ from '_';

import sliderPlugins from 'slider/slider.plugins';
import viewTemplate from './sw-output-devices.html!text';

sliderPlugins.directive('swOutputDevices', () => {

  return {
    restrict: 'E',
    scope: {
      withDevices: '=',
      activeDevice: '=',
      width: '=',
      height: '=',
      scale: '='
    },
    transclude: true,
    bindToController: true,
    controllerAs: 'model',
    template: viewTemplate,
    controller ($scope) {
      let d = new SwOutputDevices({
        $scope
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
  }

  applySize (vm, size) {
    vm.width = size.width;
    vm.height = size.height;
    vm.scale = size.scale;
  }
}
