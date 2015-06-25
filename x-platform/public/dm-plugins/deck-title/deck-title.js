/* globals define */
define(['module', 'slider/slider.plugins'], function (module, sliderPlugins) {
  var path = sliderPlugins.extractPath(module);

  sliderPlugins.registerPlugin('deck', 'title', 'deck-title', {
    name: 'Deck Title',
    description: 'Deck Title Displayed as Page Title',
    example: {
      meta: {
        type: 'string'
      },
      data: 'Deck Title'
    }
  }).directive('deckTitle', [
    '$rootScope', function ($rootScope) {
      return {
        restrict: 'E',
        scope: {
          title: '=data',
          slide: '=context'
        },
        link: function (scope, element) {
          $rootScope.title = scope.title;
        }
      };
    }
  ]);

});
