define(['angular', 'dm-xplatform/xplatform-app'], function (angular, xplatformApp) {
  xplatformApp.service('dmWorkspaces', ['$http', '$q',
    function ($http, $q) {
      function wrap (promise) {
        var res = $q.defer();
        promise.then(function (d) {
          res.resolve(d.data);
        }, function (err) {
          res.reject(err);
        });
        return res.promise;
      }

      return {
        getUsersWorkspaces: function (eventId) {
          return wrap($http.get('/api/events/' + eventId + '/workspaces'));
        },
        convertToRecording: function (userId, userName, eventName) {
          return wrap(
            $http.post('/api/workspaces/users/' + userId + '/recording', {
              userName: userName,
              eventName: eventName
            })
          );
        }
      };
    }
  ]);
});
