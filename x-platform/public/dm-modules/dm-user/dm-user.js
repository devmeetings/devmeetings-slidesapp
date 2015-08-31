/* globals define */
define(['angular', '../dm-errors/dm-errors'], function (angular) {
  'use strict';
  angular.module('dm-user', ['ngRaven']).factory('dmUser', ['$rootScope', '$http', '$q', 'Raven',
    function ($rootScope, $http, $q, Raven) {
      var data = {};
      var result;
      var cache = {};

      return {
        getUserWithId: function (id) {
          if (cache[id]) {
            return cache[id].promise;
          }

          var defer = $q.defer();
          cache[id] = defer;
          $http.get('/api/users/' + id).success(function (user) {
            defer.resolve(user);
          });

          return defer.promise;
        },
        saveCurrentUser: function (user) {
          $http.put('/api/users', user).success(function () {});

          var defer = $q.defer();
          defer.resolve(user);
          cache[user._id] = defer;

          data.result = user;
        },
        getCurrentUser: function () {
          if (result) {
            return result.promise;
          }

          result = $q.defer();
          $http.get('/api/users').success(function (user) {
            data.result = user;
            Raven.setUserContext(user);
            result.resolve(data);
            $rootScope.isLoggedIn = true;
          }).error(function (data, status) {
            Raven.setUserContext();
            result.reject(status);
            $rootScope.isLoggedIn = false;
          });
          return result.promise;
        },
        isLoggedIn: function () {
          return $rootScope.isLoggedIn;
        }
      };
    }
  ]);
});
