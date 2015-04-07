/* jshint esnext:true */

import * as $ from 'jquery';
import * as xplatformApp from 'xplatform/xplatform-app';
import * as _ from '_';

class SpaceVisuals {

  constructor($state, $location, $rootScope, $timeout, Fullscreen, dmBrowserTab) {
    _.extend(this, {
      $state, $location, $rootScope, $timeout, Fullscreen, dmBrowserTab
    });
  }

  initFullScreen($scope) {
    $scope.changeFullScreen = (enable) => {
      if (!enable) {
        this.Fullscreen.cancel();
      } else {
        this.Fullscreen.all();
      }
    };

    $scope.autoGoFullScreen = () => {
      if (this.$rootScope.performance.indexOf('player_no_full_screen') > -1) {
        return;
      }
      $scope.changeFullScreen(true);
    };

    let removeFullscreenHandler = this.Fullscreen.$on('FBFullscreen.change', () => {
      this.$rootScope.$apply(() => {
        this.$rootScope.isZenMode = this.Fullscreen.isEnabled();
      });
    });
    $scope.$on('$destroy', removeFullscreenHandler);
  }

  initSidebars($scope, localStorage) {
    let $timeout = this.$timeout;

    $scope.left = {
      min: '35px',
      max: '35px',
      current: '35px'
    };

    $scope.right = {
      min: '35px',
      max: '330px',
      current: '35px',
      opened: false,
      pinned: false
    };

    $scope.bottombarHeight = '0px';

    $scope.keys = {};
    $scope.tabs = {};
    var aSpeed = 0.2;

    $scope.togglePinRight = function() {
      var right = $scope.right;

      if (!right.defaultMin) {
        right.defaultMin = right.min;
      }

      if (right.pinned) {
        right.min = right.defaultMin;
      } else {
        right.min = right.max;
      }
      right.pinned = !right.pinned;
      if (right.pinned) {
        $scope.toggleRight(true);
      }
      localStorage.setItem('sidebar.pinned', right.pinned);
    };

    $scope.toggleRightDelayed = function(open) {
      var delay = open ? 600 : 1200;
      $timeout(function() {
        if ($scope.right.mouseOn !== open || $scope.right.pinned) {
          return;
        }
        $scope.toggleRight(open);

      }, delay);
    };

    $scope.toggleRight = function(open, force) {
      if ($scope.editMode && !force) {
        return;
      }

      var right = $scope.right;
      open = open === undefined ? !right.opened : open;

      if (open === right.opened) {
        return;
      }

      if (open) {

        $timeout(function() {

          right.current = right.max;
          $timeout(function() {
            right.opened = open;

            $('.dm-spacesidebar-right .tab-content').fadeIn(600 * aSpeed);
          }, 250 * aSpeed);

        }, 500 * aSpeed);

        return;
      }

      $('.dm-spacesidebar-right .tab-content').hide();

      right.opened = open;
      right.current = right.min;
    };

    $timeout(function() {
      $scope.toggleRightDelayed(false);
      var isPinned = localStorage.getItem('sidebar.pinned') === 'true';
      if (isPinned) {
        $scope.togglePinRight();
      }
    }, 2500);

    if ($scope.editMode) {
      $scope.right.min = $scope.right.max;
      $scope.toggleRight(true, true);
    }
  }

  initNotifications($scope) {
    $scope.notifications = {};
    $scope.$on('event.questions.update', function() {
      $scope.notifications.unread = true;
    });
  }

  initLocationWatching($scope) {
    $scope.currentLocation = this.$location;
    $scope.$watch('currentLocation.$$absUrl', () => {
      $scope.activeIteration = this.$state.params.iteration;
      $scope.showTutorial = this.$state.current.name === 'index.space';
    });
  }

  initialize($scope, $window) {
    this.initFullScreen($scope);
    this.initSidebars($scope, $window.localStorage);
    this.initNotifications($scope);
    this.initLocationWatching($scope);
  }
}

xplatformApp.service('dmSpaceVisuals', SpaceVisuals);
