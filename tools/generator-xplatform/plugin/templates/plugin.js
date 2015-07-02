 /* jshint esnext:true,-W097 */
'use strict';

import sliderPlugins from 'slider/slider.plugins';

import viewTemplate from './<%= nameDash %>.html!text';

class <%= nameCamelUpper %> {

  constructor (data) {
    _.extend(this, data);
  }

  controller (vm) {
    vm.name = '<%= nameDash %>';
  }

}

sliderPlugins
  .registerPlugin('<%= pluginNameSpace %>', '<%= pluginTrigger %>', '<%= nameDash %>', {
    name: '<%= nameDash %>',
    // TODO Fill me
    description: 'TODO',
    example: {
      meta: {
        type: 'string'
      },
      data: 'test'
    }
  })
  .directive('<%= nameCamel %>', () => {
    return {
      restrict: 'E',
      replace: true,
      scope: {
        <%= pluginTrigger %>: '=data',
        slide: '=context',
        recorder: '=recorder',
        path: '@',
        mode: '='
      },
      bindToController: true,
      controllerAs: 'vm',
      template: viewTemplate,
      controller ($scope) {
        let plugin = new <% nameCamelUpper %>({$scope});
        plugin.controller(this);
      }
    };
  });

