define(['angular', 'dm-xplatform/xplatform-app', '_'], function(angular, xplatformApp, _) {
  xplatformApp.service('dmEvents', ['$http', '$q',
    function($http, $q) {

      var promises = {};
      var annotationPromises = {};
      var states = {};

      function extractBody(data) {
        return data.data;
      }

      return {
        userEvents: function(userId) {
          return $http.get('/api/users/' + userId + '/events').then(extractBody);
        },
        allEvents: function() {
          return $http.get('/api/events').then(extractBody);
        },
        getWorkspace: function(event) {
          return $http.post('/api/events/' + event + '/base_slide').then(function(data) {
            return data.data.slidesave;
          });
        },
        getRealId: function(encId, pin) {
          return $http({
              method: 'get',
              url: '/api/events/' + encId + '/_id', 
              params: {
                pin: pin
              }
          }).then(function(data) {
            return data.data;
          });
        },
        cloneEvent: function(event) {
          event.visible = false;
          event.removed = false;
          event.title += ' (Clone)';
          event.name += new Date();

          return $http.post('/api/events', event).then(extractBody, function() {
            window.alert('Could not clone event');
          });
        },
        editEvent: function(event) {
          return $http.put('/api/events/' + event._id, event).then(extractBody, function() {
            window.alert('Could not save event!');
          });
        },
        getEvent: function(event, download) {
          var result = promises[event];

          if (result && !download) {
            return $q.when(result);
          }

          var promi = $http.get('/api/events/' + event).then(extractBody);
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
            if (data.annotations) {
              return $http.get('/api/events/' + event + '/annotations/' + data.annotations).then(extractBody);
            }
            return $http.get('/api/recordings/' + data.material + '/annotations').then(extractBody);
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
          return $http.get('/api/events/' + event + '/annotations').then(extractBody);
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
        addEventAnnotation: function(eventId, iterationId, materialId, snippet) {
          var that = this;
          return $http.post(
            ['/api/event_iteration_material_anno', eventId, iterationId, materialId].join('/'),
            snippet).then(function() {
            that.getEvent(eventId, false).then(function(eventObject) {
              var material = _.find(eventObject.iterations[iterationId].materials, {
                _id: materialId
              });
              material.annotations.push(snippet);
            });
          });
        },
        editEventAnnotation: function(eventId, iterationId, materialId, snippet) {
          return $http.put(
            ['/api/event_iteration_material_anno',
              eventId, iterationId, materialId, snippet._id
            ].join('/'),
            snippet);
        },
        deleteEventAnnotation: function(eventId, snippet) {
          console.log('deleting anno', eventId, snippet);
        }
      };
    }
  ]);
});
