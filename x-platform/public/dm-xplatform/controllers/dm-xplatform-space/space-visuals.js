/* jshint esnext:true */

import $ from 'jquery';
import xplatformApp from 'dm-xplatform/xplatform-app';
import _ from '_';

class SpaceVisuals {

  constructor ($state, $location, $rootScope, $timeout, Fullscreen, dmBrowserTab) {
    _.extend(this, {
      $state, $location, $rootScope, $timeout, Fullscreen, dmBrowserTab
    });
  }

  initFullScreen ($scope) {
    $scope.changeFullScreen = (enable) => {
      if (!enable) {
        this.Fullscreen.cancel();
      } else {
        this.Fullscreen.all();
      }
    };

    $scope.autoGoFullScreen = () => {
      if (this.$rootScope.performance.indexOf('player_full_screen') === -1) {
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

  initSidebars ($scope, localStorage) {
    let $timeout = this.$timeout;

    $scope.left = {
      min: '0px',
      baseMin: '0px',
      max: '0px',
      current: '0px'
    };

    $scope.right = {
      min: '330px',
      baseMin: '37px',
      max: '330px',
      current: '330px',
      opened: true,
      pinned: true
    };

    $scope.keys = {};
    $scope.tabs = {};
    var aSpeed = 0.2;

    $scope.togglePinRight = function () {
      var right = $scope.right;

      if (right.pinned) {
        right.min = right.baseMin;
      } else {
        right.min = right.max;
      }
      right.pinned = !right.pinned;
      if (right.pinned) {
        $scope.toggleRight(true);
      }
      localStorage.setItem('sidebar.pinned', right.pinned);
    };

    $scope.setPinRight = function (shouldBePinned) {
      if (shouldBePinned && !$scope.right.pinned) {
        $scope.togglePinRight();
        return;
      }
      if (!shouldBePinned && $scope.right.pinned) {
        $scope.togglePinRight();
        return;
      }
    };

    $scope.toggleRightDelayed = function (open) {
      var delay = open ? 600 : 1200;
      $timeout(function () {
        if ($scope.right.mouseOn !== open || $scope.right.pinned) {
          return;
        }
        $scope.toggleRight(open);
      }, delay);
    };

    $scope.toggleRight = function (open, force) {
      if ($scope.editMode && !force) {
        return;
      }

      var right = $scope.right;
      open = open === undefined ? !right.opened : open;

      if (open === right.opened) {
        return;
      }

      if (open) {
        $timeout(function () {
          right.current = right.max;
          $timeout(function () {
            right.opened = open;

            $('.dm-spacesidebar-right .tab-content').fadeIn(600 * aSpeed);
          }, 250 * aSpeed);
        }, 500 * aSpeed);

        return;
      }

      $('.dm-spacesidebar-right .tab-content').hide();

      right.opened = open;
      right.current = right.baseMin;
    };

    $scope.$watch('editMode', (isEditMode, oldVal) => {
      if (isEditMode) {
        $scope.right.min = $scope.right.max;
        $scope.toggleRight(true, true);
      } else if (oldVal === true) {
        $scope.right.min = $scope.right.baseMin;
      }
    });
  }

  initLocationWatching ($scope) {
    $scope.currentLocation = this.$location;
    $scope.$watch('currentLocation.$$absUrl', () => {
      $scope.activeIteration = this.$state.params.iteration;
      $scope.showTutorial = this.$state.current.name === 'index.space';
    });
  }

  initialize ($scope, $window) {
    this.initFullScreen($scope);
    this.initSidebars($scope, $window.localStorage);
    this.initLocationWatching($scope);
  }
}

xplatformApp.service('dmSpaceVisuals', SpaceVisuals);
