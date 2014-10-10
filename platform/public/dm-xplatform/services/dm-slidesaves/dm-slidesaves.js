define(['angular', 'xplatform/xplatform-app', '_'], function (angular, xplatformApp, _) {
    xplatformApp.service('dmSlidesaves', ['$http', '$q', function ($http, $q) {
       
        var promises = {
        };

        return {
            refresh: function(){
                delete promises['all'];
            },
            allSaves: function (download) {
                var result = promises['all'];

                if (!result || download) {
                    result =  $q.defer();
                    promises['all'] = result;
                }

                if (!download) {
                    return result.promise;
                }

                $http.get('/api/slidesaves').then(function (data) {
                    result.resolve(data.data);
                });

                return result.promise;
            },
            saveWithId: function (save, download) {
                var result = $q.defer();

                $http.get('/api/slidesaves/' + save).then(function (data) {
                    result.resolve(data.data);
                });
               
                return result.promise;
            },
            saveModified: function (save) {
                var result = $q.defer();

                $http.put('/api/slidesaves/' + save._id, save).then(function () {
                    result.resolve();
                }, function () {
                    result.reject();
                });

                return result.promise;
            },
            isMySave: function (save) {
                var result = $q.defer();
                this.allSaves(false).then(function (all) {
                    var is = !!_.find(all, function (a) {
                        return a._id === save;
                    });
                    result.resolve(is);
                });

                return result.promise;
            },
            getSaveType: function (save) {
                // workspace, mine, other
                
                var result = $q.defer();
                this.allSaves(false).then(function (all) {
                    var saveObject = _.find(all, function (a) {
                        return a._id === save;
                    });

                    if (!saveObject) {
                        return result.resolve('other');
                    }

                    return result.resolve(saveObject.baseSlide ? 'workspace' : 'mine');
                });
    
                return result.promise;
            },
            createSaveCopy: function (save) {
                var result = $q.defer();

                var saveCopy = {};

                $http.put('/api/slidesaves', saveCopy).then(function (data) {
                    result.resolve(data.data);
                }, function () {
                    result.reject();
                });

                return result.promise;
            }
        };
    }]);
});

