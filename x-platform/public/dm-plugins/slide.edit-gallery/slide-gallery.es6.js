/* jshint esnext:true,-W097 */
'use strict';

import sliderPlugins from 'slider/slider.plugins';
import _ from '_';

class PluginsGallery {

  constructor(data) {
    _.extend(this, data);
  }

  controller(vm) {
    vm.currentNamespace = 'slide';

    this.initPlugins(vm);

    vm.insertExample = (plugin) => this.insertExample(vm, plugin);
    vm.getTriggerValue = (trigger) => this.getTriggerValue(vm, trigger);
  }

  initPlugins(vm) {
    this.$scope.$watchCollection(() => Object.keys(vm.slide), () => {

      let allPlugins = sliderPlugins.getAllPlugins();
      vm.namespaces = Object.keys(allPlugins);
      vm.namespaces.map((namespace) => {
        allPlugins[namespace].map((plugin) => {
          plugin.isActive = this.isPluginActive(vm, plugin);
        });
      });
      vm.plugins = allPlugins;

    });
  }

  isActive(obj, val) {
    return obj && obj[val];
  }

  getTriggerValue(vm, trigger) {
    return this.isActive(vm.slide, trigger) ||
      this.isActive(vm.slide.left, trigger) ||
      this.isActive(vm.slide.right, trigger);
  }

  isPluginActive(vm, plugin) {
    let trigger = plugin.trigger;
    if (
      trigger === '*' || 
      this.getTriggerValue(vm, trigger)
     ) {
      return true;
    }
    return false;
  }

  insertExample(vm, plugin) {
    vm.slide[plugin.trigger] = plugin.data.example.data;
  }

  }

  sliderPlugins
  .registerPlugin('slide.edit', '*', 'slide-plugins-gallery', {
      name: 'Gallery',
      description: 'Displays Gallery of plugins',
      example: {}
  })
  .directive('slidePluginsGallery', () => {
    return {
      restrict: 'E',
      scope: {
        gallery: '=data',
        slide: '=context',
        mode: '='
      },
      bindToController: true,
      controllerAs: 'vm',
      templateUrl: '/static/dm-plugins/slide.edit-gallery/slide-gallery.html',
      controller($scope) {
        let sw = new PluginsGallery({
            $scope
        });
        sw.controller(this);
      }
    };
  });
