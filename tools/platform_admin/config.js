var _ = require('lodash'),
    glob = require('glob'),
    Q = require('q'),
    formage = require('formage');

var getModels = function () {
    var result = Q.defer();
    glob("../../platform/app/models/*.js", function(err, files) {
        var models = {};
        _.forEach(files, function (file) {
            var name = file.replace(/.js$/, '').replace(/^..\/..\/platform\/app\/models\//, '');
            models[name] = require(file);
        });
        //result.resolve({
        //    deck: require('../../platform/app/models/deck')
        //});
        result.resolve(models);
    });
    return result.promise;
};

module.exports = function(app, express) {
    formage.serve_static(app, express);
    getModels().then(function(models) {
        formage.init(app, express, models, {
            title: 'Admin',
            username: 'admin',
            password: 'admin',
            admin_users_gui: true,
            root: '/admin',
            default_section: 'main'
        });
    });
};










