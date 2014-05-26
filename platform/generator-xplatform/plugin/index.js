'use strict';
var util = require('util');
var yeoman = require('yeoman-generator');
var yosay = require('yosay');
var _s = require('underscore.string');
var path = require('path');
var fs = require('fs');
var chalk = require('chalk');

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

    (function(type, pluginPath, name){ 
      var templateExtension = '';
      switch (type){
        case "none":
          this.pluginTemplateText = 'template: \'<div ng-bind-html="data"></div>\'';
          return;
        case ".jade":
          templateExtension = '.jade';
          break;
        case ".html":
          templateExtension = '.html';
          break;
        default:
          console.assert(false, "unrecognized plugin template type: " + type);
          break;
      }
      this.pluginTemplateText = 'templateUrl: path + \'/' + name + '.html\'';
      this.write(pluginPath + name + templateExtension, '');
      this.template('plugin.js', pluginPath + name + '.js');
    }.bind(this))(this.pluginTemplateType, pluginPath, this.nameDash);

    (function(type, pluginPath, name, styleFilePath){
      var styleExtension = '';
      switch (type){
        case "none":
          return; // RETURN!
        case ".less":
          styleExtension = '.less';
          break;
        case ".css":
          styleExtension = '.css';
          break;
        default:
          console.assert(false, 'unrecognized plugin style: ' + type);
          break;
      }
      this.write(pluginPath + name + styleExtension, '');
      
      try {
        var fullStylePath = path.resolve(process.cwd(), styleFilePath);
        var fileSrc = fs.readFileSync(fullStylePath, 'utf8');
        fileSrc += ('\n' + '@import \'../plugins/' + name + '/' + name + styleExtension + '\';');
        fs.writeFileSync(fullStylePath, fileSrc);
        this.log.writeln(chalk.green(' updating') + ' %s', styleFilePath);
      } catch (e) {
        throw e;
      }
    }.bind(this))(this.pluginStyleType, pluginPath, this.nameDash, 'public/less/style.less');

  }
});

module.exports = PluginGenerator;
