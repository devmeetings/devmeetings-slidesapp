define(['_', 'slider/slider', '../utils/Plugins'], function (_, slider, Plugins) {
  slider.directive('contenteditable', [function () {
    return {
      require: 'ngModel',
      link: function (scope, elm, attrs, ctrl) {
        // view -> model
        elm.bind('input', function () {
          scope.$apply(function () {
            ctrl.$setViewValue(elm.html());
          });
        });

        // model -> view
        ctrl.$render = function () {
          elm.html(ctrl.$viewValue);
        };

      // load init value from DOM
      // ctrl.$setViewValue(elm.html());
      }
    };
  }]);
});
