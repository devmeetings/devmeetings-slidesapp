var path = require('path'),
    fs = require('fs'),
    rootPath = path.normalize(path.join(__dirname, '..')),
    env = process.env.NODE_ENV || 'development';
var staticsPath = '/static';

var realmUrl = process.env.REALM_URL || null;
var mongoHost = process.env.MONGO_HOST || "localhost";
var rabbitHost = process.env.RABBIT_HOST || "localhost";

var config = {
    development: {
        root: rootPath,
        staticsPath: staticsPath,
        jsModulesPath: staticsPath + '/js',
        doLiveReload: true,
        cacheBustingVersion: '',
        app: {
            name: 'platform'
        },
        port: 3000,
        realmUrl: realmUrl || 'http://localhost:3000',
        fb: {
            id: 1431694133754278,
            secret: "c2cb2cebdccca68ed630a061436ba012"
        },
        db: 'mongodb://' + mongoHost + '/platform-development',
        queue: rabbitHost
    },

    test: {
        root: rootPath,
        staticsPath: staticsPath,
        jsModulesPath: staticsPath + '/js/bin',
        cacheBustingVersion: '-' + fs.readFileSync('.version', {
            encoding: 'utf8'
        }),
        app: {
            name: 'platform'
        },
        port: 2000,
        fb: {
            id: 1431694133754278,
            secret: "c2cb2cebdccca68ed630a061436ba012"
        },
        realmUrl: realmUrl || 'http://xplatform.org:2000',
        db: 'mongodb://' + mongoHost + '/platform-test',
        queue: rabbitHost
    },

    staging: {
        root: rootPath,
        staticsPath: staticsPath,
        jsModulesPath: staticsPath + '/js/bin',
        withInspectlet: true,
        cacheBustingVersion: '-' + fs.readFileSync('.version', {
            encoding: 'utf8'
        }),
        app: {
            name: 'platform'
        },
        port: 7000,
        fb: {
            id: 503641503100997,
            secret: "2161dca6f444c60837e0d7578f0a8a53"
        },
        realmUrl: realmUrl || 'http://jsintro.xplatform.org',
        db: 'mongodb://' + mongoHost + '/platform-staging',
        queue: rabbitHost
    },

    production: {
        root: rootPath,
        staticsPath: staticsPath,
        jsModulesPath: staticsPath + '/js/bin',
        withGoogleAnalytics: true,
        cacheBustingVersion: '-' + fs.readFileSync('.version', {
            encoding: 'utf8'
        }),
        app: {
            name: 'platform'
        },
        port: 4000,
        fb: {
            id: 1431693610420997,
            secret: "c91cb7f914ed25e7d67e1278484f5979"
        },
        realmUrl: realmUrl || 'http://xplatform.org',
        db: 'mongodb://' + mongoHost + '/platform-production',
        queue: rabbitHost
    }
};

module.exports = config[env];