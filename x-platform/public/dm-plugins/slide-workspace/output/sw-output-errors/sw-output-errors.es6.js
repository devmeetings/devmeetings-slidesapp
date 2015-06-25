/* jshint esnext:true,-W097 */
'use strict';


import sliderPlugins from 'slider/slider.plugins';
import * as _ from '_';

class SwOutputErrors {

  constructor(data) {
    _.extend(this, data);
  }

  reset(vm) {
    vm.errors = [];
  }

  onError(vm, errors) {
    vm.errors = errors;
  }

}


sliderPlugins.directive('swOutputErrors', () => {

  return {
    restrict: 'E',
    scope: {
      currentUrl: '='
    },
    bindToController: true,
    controllerAs: 'vm',
    templateUrl: '/static/dm-plugins/slide-workspace/output/sw-output-errors/sw-output-errors.html',
    controller($scope, $window) {
      let output = new SwOutputErrors({});
      let vm = this;

      $scope.$watch(() => vm.currentUrl, () => {
        output.reset(vm);
      });

      function errorListener(ev) {
        if (!ev.data || ev.data.type !== 'errors') {
          return;
        }
        var errors = ev.data.data;
        $scope.$apply(function() {
          output.onError(vm, errors);
        });
      }

      $window.addEventListener('message', errorListener);
      $scope.$on('$destroy', ()=>{
        $window.removeEventListener('message', errorListener);
      });
    }
  };

});
