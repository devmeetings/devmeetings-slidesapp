define(['require', 'angular', 'slider/slider.plugins'], function (require, angular, sliderPlugins) {
  return function (module) {
    module = module || 'slider';
    require('<plugins>', function () {
      angular.bootstrap(document, [module]);
    });

  };
});
