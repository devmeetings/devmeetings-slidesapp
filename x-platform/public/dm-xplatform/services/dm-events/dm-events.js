define(['angular', 'xplatform/xplatform-app', '_'], function(angular, xplatformApp, _) {
  xplatformApp.service('dmEvents', ['$http', '$q',
    function($http, $q) {

      var promises = {};
      var annotationPromises = {};
      var states = {};

      function wrap(promise) {
        var res = $q.defer();
        promise.then(function(d) {
          res.resolve(d);
        }, function(err) {
          res.reject(err);
        });
        return res.promise;
      }

      return {
        userEvents: function(userId) {
          return $http.get('/api/users/' + userId + '/events').then(function(data){
            return data.data;
          });
        },
        allEvents: function() {
          var result = $q.defer();
          $http.get('/api/events').then(function(data) {
            result.resolve(data.data);
          }, function() {
            result.reject();
          });

          return result.promise;
        },
        getEvent: function(event, download) {
          var result = promises[event];

          if (result && !download) {
            return $q.when(result);
          }

          var promi = wrap($http.get('/api/events/' + event).then(function(data) {
            return data.data;
          }));
          promises[event] = promi;
          return promi;
        },
        getState: function(event, id) {
          var key = event + 'index' + id;
          if (!states[key]) {
            states[key] = {
              currentSecond: 0
            };
          }
          return states[key];
        },
        changeEventVisibility: function(event, visible) {
          $http.post('/api/event_visibility/' + event + '/' + visible);
        },
        getEventMaterial: function(event, iteration, material) {
          return this.getEvent(event, false).then(function(data) {
            var result = _.find(data.iterations[iteration].materials, function(elem) {
              return elem._id === material;
            });

            return $q.when(result);
          });
        },

        getEventAnnotations: function(event, iteration, material) {
          var key = [event, iteration, material];
          if (annotationPromises[key]) {
            return annotationPromises[key];
          }

          var promi = this.getEventMaterial(event, iteration, material).then(function(data) {
            return wrap($http.get('/api/events/' + event + '/annotations/' + data.annotations).then(function(data) {
              return data.data;
            }));
          });
          annotationPromises[key] = promi;
          return promi;
        },

        getEventTask: function(event, iteration, task) {
          return this.getEvent(event, false).then(function(data) {
            var result = _.find(data.iterations[iteration].tasks, function(elem) {
              return elem._id === task;
            });

            return $q.when(result);
          });
        },
        getAllAnnotations: function(event) {
          return wrap($http.get('/api/events/' + event + '/annotations').then(function(data) {
            return data.data;
          }));
        },
        removeEvent: function(event) {
          var result = $q.defer();
          $http.delete('/api/events/' + event).then(function() {
            result.resolve();
          }, function() {
            result.reject();
          });
          return result.promise;
        },
        createEvent: function(event) {
          var result = $q.defer();
          $http.post('/api/events', event).then(function(data) {
            result.resolve(data.data);
          }, function() {
            result.reject();
          });
          return result.promise;
        },
        addEventAnnotation: function(eventId, iterationId, materialId, snippet) {
          var that = this;
          return wrap($http.post(
            ['/api/event_iteration_material_anno', eventId, iterationId, materialId].join('/'),
            snippet)).then(function() {
            that.getEvent(eventId, false).then(function(eventObject) {
              var material = _.find(eventObject.iterations[iterationId].materials, {
                _id: materialId
              });
              material.annotations.push(snippet);
            });
          });
        },
        editEventAnnotation: function(eventId, iterationId, materialId, snippet) {
          var that = this;
          return wrap($http.put(
            ['/api/event_iteration_material_anno',
              eventId, iterationId, materialId, snippet._id
            ].join('/'),
            snippet));
        },
        deleteEventAnnotation: function(eventId, snippet) {
          console.log("deleting anno", eventId, snippet);
        }
      };
    }
  ]);
});
