var _ = require('lodash');
var glob = require('glob');
var Q = require('q');

var getModels = function () {
    var result = Q.defer();
    glob("app/models/*.js", function(err, files) {
        var models = {};
        _.forEach(files, function (file) {
            var name = file.replace(/.js$/, '').replace(/^app\/models\//, '');
            var filename = '../' + file;
            models[name] = require(filename);
        });
        result.resolve(models);
    });
    return result.promise;
};

module.exports = function(app, express) {
    getModels().then(function(models) {
        require('formage-admin').init(app, express, models, {
            title: 'Admin'
        });
    });
};










