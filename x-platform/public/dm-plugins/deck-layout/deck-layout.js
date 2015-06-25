/* globals define */
define(['_', 'slider/slider.plugins'], function (_, sliderPlugins) {
  sliderPlugins.registerPlugin('deck', 'title', 'deck-layout', {
    name: 'Deck Title',
    description: 'Displays deck title.',
    example: {
      meta: {
        type: 'string'
      },
      data: 'Deck Title'
    }
  }).directive('deckLayout', [
    'Sockets',
    function (Sockets) {
      return {
        restrict: 'E',
        scope: {
          title: '=data',
          deck: '=context'
        },
        template: '<div></div>',
        link: function (scope, element) {
          sliderPlugins.forwardEventToServer('slide.current.change', Sockets);
        }
      };
    }
  ]);

});
