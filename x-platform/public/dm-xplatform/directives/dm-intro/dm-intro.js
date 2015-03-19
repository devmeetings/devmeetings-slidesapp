define(['$', 'angular', 'xplatform/xplatform-app', 'lib/introjs'], function($, angular, xplatformApp, introJs) {
  'use strict';

  xplatformApp.directive('dmIntro', function($timeout) {
    return {
      restrict: 'A',
      link: function() {
        var intro = introJs();
        intro.setOptions({
          steps: [{
            element: '.fa-calendar',
            intro: 'Here is your agenda'
          }, {
            element: '.fa-tasks',
            intro: 'Here you can find all iterations'
          }, {
            element: '.fa-film',
            intro: 'You can watch movie by clicking it'
          }, 
          {
            element: '.btn-next-subtitle .fa-play',
            intro: 'Click on play to start thhe movie.'
          },
          {
            element: '.dm-editor',
            intro: 'Here you can watch the code being written',
            position: 'right'
          }, {
            element: 'slide-workspace-output',
            intro: 'Preview is generated in real time!',
            position: 'top'
          }]
        });

        var clickWhen = [{
          when: 'fa-calendar',
        }, {
          when: 'fa-tasks',
          click: ['.fa-tasks', '.dm-spacesidebar-left li:first-child']
        }, {
          when: 'fa-film'
        }, {
          when: 'fa-play',
          click: ['.fa-play']
        }];
  
        var delay = 100;
        intro.onbeforechange(function(elem) {
          var e = angular.element(elem);

          clickWhen.map(function(cl) {

            if (e.hasClass(cl.when)) {
              if (!cl.click) {
                setTimeout(function() {
                  e.click();
                }, delay);
              } else {
                cl.click.map(function(toClick, idx) {
                  setTimeout(function() {
                    $(toClick).click();
                  }, delay + idx * 200);
                });
              }
            }
          });
        });

        $timeout(function() {
          intro.start();
        }, 5000);
      }
    };
  });
});
