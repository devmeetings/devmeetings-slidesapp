'use strict';
var util = require('util');
var yeoman = require('yeoman-generator');
var _s = require('underscore.string');

var PluginGenerator = yeoman.generators.NamedBase.extend({
  init: function () {
    //console.log('You have created plugin with name ' + this.name_dash + '.');
  },

  askFor: function() {
    var done = this.async();
    var nameDash = this.name ? _s.slugify(this.name) : "";

    var prompts = [{
      name: 'pluginName',
      message: 'What would you like the xplatform plugin name to be?',
      default: nameDash
    }, {
      name: 'pluginType',
      message: 'What would you like your xplatform plugin type to be?',
      type: 'list',
      default: 0,
      choices: ['slide', 'deck']
    }];

    this.prompt(prompts, function (props) {
      this.nameDash = _s.slugify(props.pluginName);
      this.nameCamel = _s.camelize(this.nameDash);
      this.pluginType = props.pluginType;

      done();
    }.bind(this));
  },

  askForDetails: function() {
    var done = this.async();

    var prompts = [{
      name: 'pluginKey',
      message: 'What would you like your xplatform plugin key to be?',
      default: this.nameDash 
    }];

    this.prompt(prompts, function (props) {
      this.pluginKey = props.pluginKey;

      done();
    }.bind(this));

  },

  files: function () {
    var pluginPath = 'public/plugins/' + this.nameDash + '/';
    this.mkdir(pluginPath);
    
    this.template('plugin.js', pluginPath + this.nameDash + '.js');
  }
});

module.exports = PluginGenerator;
