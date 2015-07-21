var yaml = require('js-yaml');

module.exports = function reply (req, res, obj, process) {
  'use strict';

  if (req.query.format === 'yaml') {
    res.header('Content-Type', 'application/yaml');
    if (process) {
      obj = process(obj);
    }
    res.send(yaml.safeDump(obj));
    return;
  }

  res.send(obj);
  return;
};
