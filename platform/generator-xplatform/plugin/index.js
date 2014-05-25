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
      choices: ['slide', 'slide.edit', 'deck', 'trainer']
    }];

    this.prompt(prompts, function (props) {
      this.nameDash = _s.slugify(props.pluginName);
      this.nameCamel = _s.camelize(this.nameDash);
      this.pluginNameSpace = props.pluginNameSpace;

      done();
    }.bind(this));
  },

  askFor2: function() {
    var done = this.async();

    var prompts = [{
      name: 'pluginTrigger',
      message: 'What would you like your xplatform plugin trigger to be?',
      default: this.nameDash 
    }, {
      name: 'pluginTemplateType',
      message: 'What kind of external template would you like to use?',
      type: 'list',
      default: 0,
      choices: ['none', '.jade', '.html' ]
    }, {
      name: 'pluginStyleType',
      message: 'What kind of style would you like to use?',
      type: 'list',
      default: 0,
      choices: ['none', '.less', '.css' ]
    }];

    this.prompt(prompts, function (props) {
      this.pluginTrigger = props.pluginTrigger;
      this.pluginTemplateType = props.pluginTemplateType;
      this.pluginStyleType = props.pluginStyleType;

      done();
    }.bind(this));

  },


  files: function () {
    var pluginPath = 'public/plugins/' + this.nameDash + '/';
    this.mkdir(pluginPath);

    switch (this.pluginTemplateType){
      case "none":
        this.pluginTemplateText = 'template: <div ng-bind-html="data"></div>';
        break;
      case ".jade":
        this.pluginTemplateText = 'templateUrl: path + \'' + this.nameDash + '.jade\'';
        this.write(pluginPath + this.nameDash + '.jade', '');
        break;
      case ".html":
        this.pluginTemplateText = 'templateUrl: path + \'' + this.nameDash + '.html\'';
        this.write(pluginPath + this.nameDash + '.html', '');
        break;
      default:
        console.assert(false, "unrecognized plugin template type: " + this.pluginTemplateType);
        break;
    }

    switch (this.pluginStyleType){
      case "none":
        break;
      case ".less":
        this.write(pluginPath + this.nameDash + '.less', '');
        break;
      case ".css": 
        this.write(pluginPath + this.nameDash + '.css', '');
        break;
      default:
        console.assert(false, 'unrecognized plugin style: ' + this.pluginStyleType);
        break;
    }

    this.template('plugin.js', pluginPath + this.nameDash + '.js');

  }
});

module.exports = PluginGenerator;
