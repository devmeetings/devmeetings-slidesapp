var path = require('path');
var fs = require('fs');
var rootPath = path.normalize(path.join(__dirname, '..'));
var env = process.env.NODE_ENV || 'development';
var staticsPath = '/static';
var getVersion = function () {
  try {
    return fs.readFileSync('.version', {
      encoding: 'utf8'
    });
  } catch(e) {
    return 'dev';
  }
};

var config = {
  development: {
    isDev: true,
    name: 'development',
    root: rootPath,
    staticsPath: staticsPath,
    jsModulesPath: staticsPath + '',
    cacheBustingVersion: getVersion(),
    app: {
      name: 'platform'
    },
    port: 3000,
    livereload_port: 35729,
    realmUrl: 'https://localhost:3000',
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
    db: 'mongodb://localhost/platform-box',
    store: 'redis://localhost:6379',
    graylog: false,
    meteorProxy: 'http://localhost:3001/',
    logger: 'dev'
  },

  test: {
    name: 'test',
    root: rootPath,
    staticsPath: staticsPath,
    jsModulesPath: staticsPath + '/bin',
    cacheBustingVersion: getVersion(),
    app: {
      name: 'platform'
    },
    port: 2000,
    livereload_port: 35729,
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
    cookieName: 'test.new_xplatform.sid',
    realmUrl: 'http://xplatform.org:2000',
    db: 'mongodb://localhost/platform-test',
    store: 'redis://localhost:6379/2',
    graylog: false,
    meteorProxy: false,
    logger: 'dev'
  },

  staging: {
    name: 'staging',
    root: rootPath,
    staticsPath: staticsPath,
    jsModulesPath: staticsPath + '/bin',
    withInspectlet: true,
    withGoogleAnalytics: 'UA-52669907-2',
    cacheBustingVersion: getVersion(),
    app: {
      name: 'platform'
    },
    port: 7000,
    livereload_port: 35729,
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
    cookieName: 'staging.new_xplatform.sid',
    realmUrl: 'https://staging.xplatform.org',
    db: 'mongodb://localhost/platform-staging',
    store: 'redis://localhost:6379/1',
    graylog: {
      host: 'pinkiepie.todr.me',
      port: 1782
    },
    meteorProxy: false,
    logger: 'dev'
  },

  production: {
    name: 'production',
    root: rootPath,
    staticsPath: staticsPath,
    jsModulesPath: staticsPath + '/bin',
    withInspectlet: true,
    withGoogleAnalytics: 'UA-52669907-1',
    cacheBustingVersion: getVersion(),
    app: {
      name: 'platform'
    },
    port: 4000,
    livereload_port: 35729,
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
    cookieName: 'new_xplatform.sid',
    realmUrl: 'https://xplatform.org',
    db: 'mongodb://localhost/platform-production',
    store: 'redis://localhost:6379',
    graylog: {
      host: 'pinkiepie.todr.me',
      port: 1782
    },
    logger: 'combined'
  },

  box: {
    name: 'box',
    root: rootPath,
    staticsPath: staticsPath,
    jsModulesPath: staticsPath + '/bin',
    withGoogleAnalytics: 'UA-52669907-1',
    cacheBustingVersion: getVersion(),
    app: {
      name: 'platform'
    },
    port: 4000,
    livereload_port: 35729,
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
    cookieName: 'new_xplatform.sid',
    realmUrl: 'http://192.168.10.1',
    db: 'mongodb://localhost/platform-box',
    store: 'redis://localhost:6379',
    graylog: false,
    logger: 'combined'
  }
};

var currentConfig = config[env];
// Append version
require('fs').readFile(__dirname + '/../public/version', 'utf8', function (err, version) {
  if (err) {
    version = '';
  }
  'use strict';

  currentConfig.version = version || '';
  currentConfig.version += '[' + currentConfig.name.slice(0, 3) + ']';
});

// Parse ENV variables
var fromEnv = {
  port: process.env.PORT,
  realmUrl: process.env.REALM_URL,
  db: process.env.MONGO_URL,
  store: process.env.REDIS_URL,
  livereload_port: process.env.LIVERELOAD_PORT,
  cookieDomain: process.env.COOKIE_DOMAIN
};

Object.keys(fromEnv).map(function (k) {
  'use strict';
  if (fromEnv[k]) {
    currentConfig[k] = fromEnv[k];
  }
});

// Fix ports
(function () {
  'use strict';

  var instance = parseInt(process.env.NODE_APP_INSTANCE || 0, 10);

  ['port', 'livereload_port'].map(function (v) {
    currentConfig[v] = parseInt(currentConfig[v], 10) + instance;
  });
}());

// Append CookieDomain
(function (c) {
  'use strict';

  if (c.isDev || c.cookieDomain) {
    return;
  }

  var cookieDomain;
  cookieDomain = c.realmUrl.replace(/https?:\/\//, '');
  cookieDomain = cookieDomain.replace(/:[0-9]+$/, '');
  var domainParts = cookieDomain.split('.').reverse();
  c.cookieDomain = '.' + domainParts[1] + '.' + domainParts[0];

}(currentConfig));

module.exports = currentConfig;
