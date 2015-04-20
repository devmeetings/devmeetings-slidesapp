var path = require('path'),
  fs = require('fs'),
  rootPath = path.normalize(path.join(__dirname, '..')),
  env = process.env.NODE_ENV || 'development';
var staticsPath = '/static';

var realmUrl = process.env.REALM_URL || null;
var mongoHost = process.env.MONGO_HOST || 'localhost';
var redisConf = process.env.REDIS_HOST || 'localhost:6379';

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
    realmUrl: realmUrl || 'https://localhost:3000',
    google: {
      id: '77504101207-ea4njaur49ekiq5hssfcvjin81ral4qv.apps.googleusercontent.com',
      secret: 'M7_CZZL5jsdbMdkE8Sqw0z4H'
    },
    fb: {
      id: 1431694133754278,
      secret: 'c2cb2cebdccca68ed630a061436ba012'
    },
    github: {
      clientId: '106ca39a17b1ca369f6f',
      clientSecret: 'accf1a3f361eec1902172ce287acf46a34423cc2'
    },
    db: 'mongodb://' + mongoHost + '/platform-box',
    store: redisConf,
    graylog: false,
    meteorProxy: 'https://localhost:3001/',
    logger: 'dev'
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
    google: {
      id: '77504101207-ea4njaur49ekiq5hssfcvjin81ral4qv.apps.googleusercontent.com',
      secret: 'M7_CZZL5jsdbMdkE8Sqw0z4H'
    },
    fb: {
      id: 1431694133754278,
      secret: 'c2cb2cebdccca68ed630a061436ba012'
    },
    github: {
      clientId: '81c1de02cccf83b4a849',
      clientSecret: 'dbfae534374ee193f85b9e7be8cc3b25811ddf31'
    },
    cookieName: 'test.xplatform.sid',
    realmUrl: realmUrl || 'http://xplatform.org:2000',
    db: 'mongodb://' + mongoHost + '/platform-test',
    store: redisConf,
    graylog: false,
    meteorProxy: false,
    logger: 'dev'
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
    google: {
      id: '77504101207-ea4njaur49ekiq5hssfcvjin81ral4qv.apps.googleusercontent.com',
      secret: 'M7_CZZL5jsdbMdkE8Sqw0z4H'
    },
    fb: {
      id: 503641503100997,
      secret: '2161dca6f444c60837e0d7578f0a8a53'
    },
    github: {
      clientId: '9bc4587bb4a474187812',
      clientSecret: '676949bd66e064f68b8bd5a6367b61e3cd4bc7be'
    },
    cookieName: 'staging.xplatform.sid',
    realmUrl: realmUrl || 'https://staging.xplatform.org',
    db: 'mongodb://' + mongoHost + '/platform-staging',
    store: redisConf,
    graylog: {
      host: 'pinkiepie.todr.me',
      port: 1782
    },
    meteorProxy: false,
    logger: 'dev'
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
    google: {
      id: '77504101207-ea4njaur49ekiq5hssfcvjin81ral4qv.apps.googleusercontent.com',
      secret: 'M7_CZZL5jsdbMdkE8Sqw0z4H'
    },
    fb: {
      id: 1431693610420997,
      secret: 'c91cb7f914ed25e7d67e1278484f5979'
    },
    github: {
      clientId: '81c1de02cccf83b4a849',
      clientSecret: 'dbfae534374ee193f85b9e7be8cc3b25811ddf31'
    },
    cookieName: 'xplatform.sid',
    realmUrl: realmUrl || 'https://xplatform.org',
    db: 'mongodb://' + mongoHost + '/platform-production',
    store: redisConf,
    graylog: {
      host: 'pinkiepie.todr.me',
      port: 1782
    },
    logger: 'combined'
  },

  box: {
    root: rootPath,
    staticsPath: staticsPath,
    jsModulesPath: staticsPath + '/bin',
    withGoogleAnalytics: 'UA-52669907-1',
    cacheBustingVersion: '-' + fs.readFileSync('.version', {
      encoding: 'utf8'
    }),
    app: {
      name: 'platform'
    },
    port: 4000,
    google: {
      id: '77504101207-ea4njaur49ekiq5hssfcvjin81ral4qv.apps.googleusercontent.com',
      secret: 'M7_CZZL5jsdbMdkE8Sqw0z4H'
    },
    fb: {
      id: 1431693610420997,
      secret: 'c91cb7f914ed25e7d67e1278484f5979'
    },
    github: {
      clientId: '4b7631db038a99b89c34',
      clientSecret: '3c562e15cf5ed88ce132041f4a1033c7529d8ffe'
    },
    cookieName: 'xplatform.sid',
    realmUrl: realmUrl || 'http://192.168.10.1',
    db: 'mongodb://' + mongoHost + '/platform-box',
    store: redisConf,
    graylog: false,
    logger: 'combined'
  }
};

module.exports = config[env];
