/* globals define */
define(['angular', 'dm-xplatform/xplatform-app', '_'], function (angular, xplatformApp, _) {
  xplatformApp.service('dmSlidesaves', ['$http', '$q', 'Sockets', function ($http, $q, Sockets) {
    var promises = {
    };

    return {
      refresh: function () {
        delete promises.all;
      },
      allSaves: function (download) {
        var result = promises.all;
        if (!download && result) {
          return $q.when(result);
        }

        return $http.get('/api/slidesaves').then(function (data) {
          promises.all = data.data;
          return data.data;
        });
      },
      saveWithId: function (save, download) {
        var result = $q.defer();

        $http.get('/api/slidesaves/' + save).then(function (data) {
          result.resolve(data.data);
        });

        return result.promise;
      },
      saveModified: function (myId, stateId, shouldRefreshPage) {
        var result = $q.defer();

        Sockets.emit('slidesaves.save', {
          slide: myId,
          stateId: stateId,
          shouldRefreshPage: shouldRefreshPage
        }, function (res) {
          result.resolve(res);
        });

        return result.promise;
      }
    };
  }]);
});
