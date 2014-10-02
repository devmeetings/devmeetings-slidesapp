define(['angular', 'xplatform/xplatform-app', '_'], function(angular, xplatformApp, _) {
    xplatformApp.service('dmEvents', ['$http', '$q',
        function($http, $q) {

            var promises = {};

            var states = {};

            return {
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

                    if (!result || download) {
                        result = $q.defer();
                        promises[event] = result;
                    }

                    if (!download) {
                        return result.promise;
                    }

                    $http.get('/api/events/' + event).then(function(data) {
                        result.resolve(data.data);
                    }, function() {
                        result.reject();
                    });

                    return result.promise;
                },
                getState: function(event, id) {
                    var key = event + 'index' + id;
                    if (!states[key]) {
                        states[key] = {};
                    }
                    return states[key];
                },
                changeEventVisibility: function(event, visible) {
                    $http.post('/api/event_visibility/' + event + '/' + visible);
                },
                eventTaskDone: function(event, task, done) {
                    $http.post('/api/event_task_done/' + event + '/' + task + '/' + done);
                },
                getEventMaterial: function(event, iteration, material) {
                    return this.getEvent(event, false).then(function(data) {
                        var result = _.find(data.iterations[iteration].materials, function(elem) {
                            return elem._id === material;
                        });

                        return $q.when(result);
                    });
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
                    return this.getEvent(event, false).then(function(data) {
                        var result = _.reduce(data.iterations, function(acc, iteration, index) {
                            return acc.concat(_.reduce(iteration.materials, function(subacc, material) {
                                material.annotations.forEach(function(anno) {
                                    anno.index = index;
                                });
                                return subacc.concat(material.annotations);
                            }, []));
                        }, []);

                        return $q.when(result);
                    });
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
                createEventIteration: function(event, iteration) {
                    var result = $q.defer();
                    var that = this;
                    $http.post('/api/event_iteration/' + event, iteration).then(function(data) {
                        var i = data.data;
                        that.getEvent(event, false).then(function(eventObject) {
                            eventObject.iterations.push(i);
                            result.resolve(i);
                        });
                    }, function() {
                        result.reject();
                    });
                    return result.promise;
                },
                removeEventIteration: function(event, iteration) {
                    var result = $q.defer();
                    var that = this;
                    $http.delete('/api/event_iteration/' + event + '/' + iteration).then(function() {
                        that.getEvent(event, false).then(function(eventObject) {
                            _.remove(eventObject.iterations, function(i) {
                                return i._id === iteration;
                            });
                            result.resolve();
                        }, function() {
                            result.reject();
                        });
                    });
                    return result.promise;
                },
                addEventAnnotation: function(eventId, iterationId, materialId, snippet) {
                    console.log("adding anno", arguments);
                    
                    $http.post(['/api/event_iteration_material_anno', eventId, iterationId, materialId].join('/'), snippet)
                        .then(function(){

                        });
                },
                editEventAnnotation: function(eventId, snippet) {
                   console.log("editing anno", eventId, snippet);
                },
                deleteEventAnnotation: function(eventId, snippet) {
                    console.log("deleting anno", eventId, snippet);
                }
            };
        }
    ]);
});