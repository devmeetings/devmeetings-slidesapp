'use strict';
var util = require('util');
var yeoman = require('yeoman-generator');
var yosay = require('yosay');
var _s = require('underscore.string');

var PluginGenerator = yeoman.generators.NamedBase.extend({
  init: function () {
    this.log(yosay('Welcome to xplatform plugin generator'));
  },


  askFor: function() {
    var done = this.async();
    var nameDash = this.name ? _s.slugify(this.name) : "";

    var prompts = [{
      name: 'pluginName',
      message: 'What would you like the xplatform plugin name to be?',
      default: nameDash
    }, {
      name: 'pluginNameSpace',
      message: 'What would you like your xplatform plugin namespace to be?',
      type: 'list',
      default: 0,
      choices: ['slide', 'deck']
    }];

    this.prompt(prompts, function (props) {
      this.nameDash = _s.slugify(props.pluginName);
      this.nameCamel = _s.camelize(this.nameDash);
      this.pluginNameSpace = props.pluginNameSpace;

      done();
    }.bind(this));
  },

  askForDetails: function() {
    var done = this.async();

    var prompts = [{
      name: 'pluginTrigger',
      message: 'What would you like your xplatform plugin trigger to be?',
      default: this.nameDash 
    }];

    this.prompt(prompts, function (props) {
      this.pluginTrigger = props.pluginTrigger;

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
