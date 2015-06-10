var exec = require('child_process').exec;

exports.initApi = function(app, authenticated, app2, router2, logger) {
  'use strict';

  app.get('/ionic/app', authenticated, function(req, res) {
    var contentSrcPath = req.query.path || '';
    var xplaIdx = Math.max(contentSrcPath.indexOf('xplatform'), contentSrcPath.indexOf('localhost'));

    if (xplaIdx === -1 || xplaIdx > 40) {
      logger.warn('Refusing to create app for url %s', contentSrcPath);
      res.sendStatus(400);
      return;
    }

    var targetFile = '/tmp/ionicapp/app/platforms/android/build/outputs/apk/android-debug.apk';
    var buildProc = exec(
      './buildApp.sh "' + contentSrcPath + '"', {
        cwd: __dirname,
        env: process.env
      });

    var output = '';
    buildProc.stdout.on('data', function(data) {
      output += data;
    });

    buildProc.stderr.on('data', function(data) {
      output += data;
    });


    buildProc.on('close', function(code) {
      logger.log(output);
      if (code) {
        res.status(400).send('' + code + output);
        return;
      }
      res.attachment('xpla-ionic.apk');
      res.sendFile(targetFile);
    });

  });

};
