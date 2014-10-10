define(['angular', 'xplatform/xplatform-app', '_'], function (angular, xplatformApp, _) {
    xplatformApp.service('dmSlidesaves', ['$http', '$q', 'Sockets', function ($http, $q, Sockets) {
       
        var promises = {
        };

        return {
            refresh: function(){
                delete promises['all'];
            },
            allSaves: function (download) {
                var result = promises['all'];
                if (!download && result) {
                    return $q.when(result);
                }

                return $http.get('/api/slidesaves').then(function (data) {
                    promises['all'] = data.data;
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
            saveModified: function (save) {
                var result = $q.defer();

                Sockets.emit('slidesaves.save', {
                    slide: save._id,
                    data: save
                }, function(res){
                    result.resolve(res);
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
            getSaveType: function (save,  force) {
                // workspace, mine, other
                
                var result = $q.defer();
                this.allSaves(force).then(function (all) {
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

