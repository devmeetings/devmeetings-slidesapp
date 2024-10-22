/* globals define */
define(['module', 'angular', '$', '_', 'ace', 'slider/slider.plugins', './editor.html!text'], function (module, angular, $, _, ace, sliderPlugins, viewTemplate) {
  ace = ace.default;

  var UPDATE_THROTTLE_TIME = 1000;

  var toNiceJson = function (str) {
    return JSON.stringify(str, null, 2);
  };

  var toNiceJsonFromString = function (string) {
    return toNiceJson(JSON.parse(string));
  };

  sliderPlugins.registerPlugin('slide.edit', '*', 'slideedit-editor', {
    order: 0,
    name: 'Editor (editMode)',
    description: 'Displays Slide JSON in editable form',
    example: {}
  }).directive('slideeditEditor', ['$rootScope', '$window', '$http',
    function ($rootScope, $window, $http) {
      return {
        restrict: 'E',
        scope: {
          slide: '=context'
        },
        template: viewTemplate,
        link: function (scope, element) {
          scope.collapsed = true;

          var editor = ace.edit($(element[0]).find('.editor')[0]);
          editor.$blockScrolling = Infinity;
          editor.setTheme('ace/theme/todr');
          editor.getSession().setMode('ace/mode/json');
          editor.setFontSize(16);
          editor.setValue(JSON.stringify(scope.slide, null, 2));
          editor.clearSelection();

          scope.$watch('collapsed', function () {
            editor.resize();
          });

          var updateSlideContent = function () {
            var value = editor.getValue();
            scope.$apply(function () {
              try {
                scope.slide = JSON.parse(value);
                $rootScope.$broadcast('slide', scope.slide);
              } catch (e) {
                console.warn(e);
              }
            });
          };

          var updateSlideContentThrottled = _.throttle(updateSlideContent, UPDATE_THROTTLE_TIME, {
            leading: false,
            trailing: true
          });
          editor.on('change', updateSlideContentThrottled);

          scope.$watch('slide', _.throttle(function (newSlide, oldSlide) {
            if (newSlide === undefined) {
              return;
            }

            // Copy slide to cut off some angular properties
            var slideCopy = angular.copy(newSlide);
            // Convert to nice json
            var slideString = toNiceJson(slideCopy);
            // To compare content instead of formatting issues reformat to JSON
            var editorContentFormatted = toNiceJsonFromString(editor.getValue());

            if (editorContentFormatted !== slideString) {
              editor.off('change', updateSlideContentThrottled);
              var cursorPosition = editor.getCursorPosition();
              editor.setValue(slideString);
              editor.clearSelection();
              editor.moveCursorToPosition(cursorPosition);
              editor.on('change', updateSlideContentThrottled);
            }
          }, UPDATE_THROTTLE_TIME, {
            leading: false,
            trailing: true
          }), true);
        }
      };
    }
  ]);
});
