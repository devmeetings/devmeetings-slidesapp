/* globals define */
define(['module', 'slider/slider.plugins', 'services/DeckAndSlides', './slide-commit.html!text'], function (module, sliderPlugins, DaS, viewTemplate) {
  sliderPlugins.registerPlugin('slide', 'commit', 'slide-commit', {
    name: 'Commit',
    description: '?? Option to save work on current slide. //TODO [ToDr] Not sure how (if) it works',
    example: {
      meta: 'isPresent',
      data: true
    },
    order: 10000
  }).directive('slideCommit', [
    'Sockets', 'DeckAndSlides', '$window',
    function (Sockets, DeckAndSlides, $window) {
      return {
        restrict: 'E',
        scope: {
          data: '=data',
          slide: '=context'
        },
        template: viewTemplate,
        link: function (scope, element) {
          scope.committing = false;
          scope.showDetails = false;
          scope.commitMessage = '';

          scope.commit = function () {
            scope.committing = true;

            Sockets.emit('slide.commit', {
              deckId: DeckAndSlides.deckId,
              parentId: DeckAndSlides.slideId,
              slideContent: scope.slide,
              message: scope.commitMessage
            }, function (data) {
              scope.$apply(function () {
                scope.commitMessage = '';
                scope.committing = false;
                scope.showDetails = false;

              // TODO [ToDr] Not sure if this should happen?
              // $window.location = '/slides/' + data.data;
              });
            });
          };
        }
      };
    }
  ]);
});
