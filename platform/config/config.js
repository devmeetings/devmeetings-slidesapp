var path = require('path'),
    rootPath = path.normalize(path.join(__dirname, '..')),
    env = process.env.NODE_ENV || 'development';
var staticsPath = '/static';

var realmUrl = process.env.REALM_URL || null;

var config = {
    development: {
        root: rootPath,
        staticsPath: staticsPath,
        app: {
            name: 'platform'
        },
        port: 3000,
        realmUrl: realmUrl || 'http://localhost:3000',
        fb: {
            id: 1431694133754278,
            secret: "c2cb2cebdccca68ed630a061436ba012"
        },
        db: 'mongodb://localhost/platform-development'
    },

    test: {
        root: rootPath,
        staticsPath: staticsPath,
        app: {
            name: 'platform'
        },
        port: 2000,
        fb: {
            id: 1431694133754278,
            secret: "c2cb2cebdccca68ed630a061436ba012"
        },
        realmUrl: realmUrl || 'http://xplatform.org:2000',
        db: 'mongodb://localhost/platform-test'
    },

    production: {
        root: rootPath,
        staticsPath: staticsPath,
        app: {
            name: 'platform'
        },
        port: 4000,
        fb: {
            id: 1431693610420997,
            secret: "c91cb7f914ed25e7d67e1278484f5979"
        },
        realmUrl: realmUrl || 'http://xplatform.org',
        db: 'mongodb://localhost/platform-production'
    }
};

module.exports = config[env];