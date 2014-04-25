var path = require('path'),
    rootPath = path.normalize(path.join(__dirname, '..')),
    env = process.env.NODE_ENV || 'development';
var staticsPath = '/static';

var config = {
    development: {
        root: rootPath,
        staticsPath: staticsPath,
        app: {
            name: 'platform'
        },
        port: 3000,
        db: 'mongodb://localhost/platform-development'
    },

    test: {
        root: rootPath,
        staticsPath: staticsPath,
        app: {
            name: 'platform'
        },
        port: 3000,
        db: 'mongodb://localhost/platform-test'
    },

    production: {
        root: rootPath,
        staticsPath: staticsPath,
        app: {
            name: 'platform'
        },
        port: 3000,
        db: 'mongodb://localhost/platform-production'
    }
};

module.exports = config[env];