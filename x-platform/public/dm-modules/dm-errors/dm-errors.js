/* globals define */
define(['angular', 'raven-js'], function (angular, Raven) {
  'use strict';
  var RavenConfig = {
    dsn: 'https://981465155ac444e8b653958d03d2c034:f86b3eec7c5b494c977f86aa91273cb8@app.getsentry.com/51505'
  };

  function ngRavenProvider ($provide) {
    $provide.decorator('$exceptionHandler', [
      'RavenConfig', '$delegate',
      ngRavenExceptionHandler
    ]);
  }

  function ngRavenExceptionHandler (RavenConfig, $delegate) {
    if (!RavenConfig) {
      throw new Error('RavenConfig must be set before using this');
    }

    Raven.config(RavenConfig.dsn, RavenConfig.config).install();
    return function angularExceptionHandler (ex, cause) {
      $delegate(ex, cause);
      Raven.captureException(ex, {
        extra: {
          cause: cause
        }
      });
    };
  }

  angular.module('ngRaven', [])
    .config(['$provide', ngRavenProvider])
    .value('RavenConfig', RavenConfig)
    .value('Raven', Raven);
});
