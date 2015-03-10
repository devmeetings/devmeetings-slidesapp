define(['angular', 'xplatform/xplatform-app', '_'], function(angular, xplatformApp, _) {
  xplatformApp.controller('dmXplatformWorkshoplist', function($scope, $stateParams, dmEvents, dmUser) {

    dmEvents.allEvents().then(function(events) {
      $scope.courses = events;

      dmUser.getCurrentUser().then(function(user) {
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

    $scope.create = function() {
      dmEvents.createEvent({
        title: 'new event'
      }).then(function(event) {
        $scope.courses.push(event);
      });
    };
  });
});
