/* globals define */
define(['require', 'angular', 'slider/slider.plugins', 'dm-plugins/plugins'], function (require, angular, sliderPlugins) {
  return function (module) {
    module = module || 'slider';
    angular.bootstrap(document, [module]);
  };
});
