module.exports = function (app, session, sessionConfig) {
  'use strict';
  var sessionMiddleware = session(sessionConfig);

  app.use(sessionMiddleware);
  // Retrying with session
  app.use(function (req, res, next) {
    if (!req.session) {
      return next(new Error("Couldn't create session"));
    }
    return next();
  });
};
