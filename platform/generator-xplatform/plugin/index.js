'use strict';
var util = require('util');
var yeoman = require('yeoman-generator');
var _s = require('underscore.string');

var PluginGenerator = yeoman.generators.NamedBase.extend({
  init: function () {
    this.name_dash = _s.slugify(this.name);
    this.name_camel = _s.camelize(this.name);
    console.log('You have created plugin with name ' + this.name_dash + '.');
  },

  files: function () {
    var plugin_path = 'public/plugins/' + this.name_dash + '/';
    this.mkdir(plugin_path);
    
    this.template('plugin.js', plugin_path + this.name_dash;
  }
});

module.exports = PluginGenerator;
