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
        jsModulesPath: staticsPath + '',
        doLiveReload: true,
        cacheBustingVersion: '',
        app: {
            name: 'platform'
        },
        port: 3000,
        cookieDomain: undefined,
        realmUrl: realmUrl || 'http://localhost:3000',
        fb: {
            id: 1431694133754278,
            secret: "c2cb2cebdccca68ed630a061436ba012"
        },
        github: {
            clientId: '106ca39a17b1ca369f6f',
            clientSecret: 'accf1a3f361eec1902172ce287acf46a34423cc2'
        },
        db: 'mongodb://' + mongoHost + '/platform-development',
        queue: rabbitHost,
        graylog: false,
        logger: 'dev',
        teamspeak: {
            host: "62.67.42.152",
            port: "9100",
            sid: 3699,
            login: "mganko",
            password: "Y3CyxVbF"
        }
    },

    test: {
        root: rootPath,
        staticsPath: staticsPath,
        jsModulesPath: staticsPath + '/bin',
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
        github: {
            clientId: '81c1de02cccf83b4a849',
            clientSecret: 'dbfae534374ee193f85b9e7be8cc3b25811ddf31'
        },
        cookieName: 'test.xplatform.sid',
        realmUrl: realmUrl || 'http://xplatform.org:2000',
        db: 'mongodb://' + mongoHost + '/platform-test',
        queue: rabbitHost,
        graylog: false,
        logger: 'dev',
        teamspeak: {
            host: "62.67.42.152",
            port: "9100",
            sid: 3699,
            login: "mganko",
            password: "Y3CyxVbF"
        }
    },

    staging: {
        root: rootPath,
        staticsPath: staticsPath,
        jsModulesPath: staticsPath + '/bin',
        withInspectlet: true,
        withGoogleAnalytics: 'UA-52669907-2',
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
        github: {
            clientId: '9bc4587bb4a474187812',
            clientSecret: '676949bd66e064f68b8bd5a6367b61e3cd4bc7be'
        },
        cookieName: 'staging.xplatform.sid',
        realmUrl: realmUrl || 'http://staging.xplatform.org',
        db: 'mongodb://' + mongoHost + '/platform-staging',
        queue: rabbitHost,
        graylog: {
            host: 'pinkiepie.todr.me',
            port: 1782
        },
        logger: 'dev',
        teamspeak: {
            host: "62.67.42.152",
            port: "9100",
            sid: 3699,
            login: "mganko",
            password: "Y3CyxVbF"
        }
    },

    production: {
        root: rootPath,
        staticsPath: staticsPath,
        jsModulesPath: staticsPath + '/bin',
        withInspectlet: true,
        withGoogleAnalytics: 'UA-52669907-1',
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
        github: {
            clientId: '81c1de02cccf83b4a849',
            clientSecret: 'dbfae534374ee193f85b9e7be8cc3b25811ddf31'
        },
        cookieName: 'xplatform.sid',
        realmUrl: realmUrl || 'https://xplatform.org',
        db: 'mongodb://' + mongoHost + '/platform-production',
        queue: rabbitHost,
        graylog: {
            host: 'pinkiepie.todr.me',
            port: 1782
        },
        logger: 'prod',
        teamspeak: {
            host: "62.67.42.152",
            port: "9100",
            sid: 3699,
            login: "mganko",
            password: "Y3CyxVbF"
        }
    }
};

module.exports = config[env];
