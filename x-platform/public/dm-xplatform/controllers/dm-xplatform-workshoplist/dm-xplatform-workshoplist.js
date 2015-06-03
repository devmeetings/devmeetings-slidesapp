define([
    'angular', 'dm-xplatform/xplatform-app', '_', './unlock/dm-unlock.es6'
], function(angular, xplatformApp, _) {

  /**
   * Converts an HSL color value to RGB. Conversion formula
   * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
   * Assumes h, s, and l are contained in the set [0, 1] and
   * returns r, g, and b in the set [0, 255].
   *
   * @param   Number  h       The hue
   * @param   Number  s       The saturation
   * @param   Number  l       The lightness
   * @return  Array           The RGB representation
   */
  function hslToRgb(h, s, l) {
    var r, g, b;

    if (s === 0) {
      r = g = b = l; // achromatic
    } else {
      var hue2rgb = function hue2rgb(p, q, t) {
        if (t < 0) {
          t += 1;
        }
        if (t > 1) {
          t -= 1;
        }
        if (t < 1 / 6) {
          return p + (q - p) * 6 * t;
        }
        if (t < 1 / 2) {
          return q;
        }
        if (t < 2 / 3) {
          return p + (q - p) * (2 / 3 - t) * 6;
        }
        return p;
      };

      var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      var p = 2 * l - q;
      r = hue2rgb(p, q, h + 1 / 3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1 / 3);
    }

    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
  }


  xplatformApp.controller('dmXplatformWorkshoplist', function($scope, $stateParams, dmEvents, dmUser, dmSpaceRedirect, $modal, $state, $window) {

    dmEvents.allEvents().then(function(events) {
      $scope.courses = events;

      dmUser.getCurrentUser().then(function(user) {
        $scope.user = user;
        return dmEvents.userEvents(user.result._id);
      }).then(function(userEvents) {
        $scope.my_courses = userEvents.map(function(evId) {
          return _.find(events, {
            _id: evId
          });
        }).filter(function(event) {
          return !!event;
        });
      });
    });

    $scope.getUnsafeAddress = function(course) {
      return dmSpaceRedirect.getUnsafeAddress().replace('/courses', '/space/' + course._id + '/learn/agenda');
    };

    $scope.visibilityChanged = function(event) {
      dmEvents.changeEventVisibility(event._id, event.visible);
    };

    $scope.remove = function(event) {
      dmEvents.removeEvent(event._id).then(function() {
        _.remove($scope.courses, function(c) {
          return c._id === event._id;
        });
      });
    };

    function getBackgroundColor(course) {
      var id = parseInt(course._id, 16) % 360;

      var color = hslToRgb(id / 360, 0.2, 0.3);

      return '#' + color.map(function(c) {
        return c.toString(16);
      }).join('');
    }
    $scope.getBackgroundStyles = function(course) {
      if (course.image) {
        return {
          'background': 'url(' + course.image + ') left center',
          'background-size': 'cover'
        };
      }
      return {
        'background-color': getBackgroundColor(course)
      };
    };

    $scope.getDescription = function(courseTitle) {
      var chars = /([a-z]{4})/i.exec(courseTitle);
      return chars[1];
    };


    $scope.unlockCourse = function(course) {
      var modalInstance = $modal.open({
        templateUrl: '/static/dm-xplatform/controllers/dm-xplatform-workshoplist/unlock/dm-unlock.html',
        controller: 'dmXplatformWorkshopUnlock',
        size: 'sm',
        resolve: {
          course: function() {
            return course;
          }
        }
      });
      modalInstance.result.then(function(id) {
        if (course.shouldRedirectToUnsafe) {
          var url = $scope.getUnsafeAddress(course);
          $window.location = url;
        } else {
          $state.go('index.space.learn.agenda', {
            event: id
          });
        }
      });
    };

  });
});
