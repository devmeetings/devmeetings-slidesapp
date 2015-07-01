/* jshint esnext:true,-W097 */
'use strict';

import sliderPlugins from 'slider/slider.plugins';
import * as _ from '_'; 



sliderPlugins.directive('swEditorCdn', ($log) => {

  return {
    restrict: 'E',
    replace: true,
    scope: {
      activeTabName: '=',
      activeTab: '=',
      onRefreshContent: '&',
      cdnLibraries: '='
    },
    bindToController: true,
    controllerAs: 'cdn',
    templateUrl: '/static/dm-plugins/slide-workspace/editor/sw-editor-cdn/sw-editor-cdn.html',
    controller: function($scope, $log) {
      let self = this;

      var libraries = [ 
        {
          'name':'jQuery',
          'source':'/cdn/jquery/2.1.4/jquery.min.js',
          'tagCategory':'script'
        },
        { 
          'name':'AngularJS',
          'source':'/cdn/angular.js/1.3.14/angular.js',
          'tagCategory':'script'
        },
        { 
          'name':'Bootstrap (JS)',
          'source':'/cdn/bootstrap/3.3.5/js/bootstrap.js',
          'tagCategory':'script'
        },
        { 
          'name':'Bootstrap (CSS)',
          'source':'/cdn/bootstrap/3.3.5/css/bootstrap.min.css',
          'tagCategory':'link'
        }
      ];

      function insertToString(input, index, string) {

        if (index > 0) {
          return input.substring(0, index) + string + input.substring(index, input.length);
        } else {
          return string + input;
        } 
      }

      self.getLibraries = function() {

        if ( self.cdnLibraries.libraries && self.cdnLibraries.libraries.length >= 1 ) {
          return self.cdnLibraries.libraries;
        }
        return libraries;
      };

      self.selectLibrary = function(library) {
        var code = self.activeTab.content;

        function getCodeToInsert(source, tagCategory) {

          if (tagCategory === 'link') {
            return '<link href="'+source+'" rel="stylesheet">\n';
          } 
          
          if (tagCategory === 'script') {
            return '<script src="'+source+'"></script>\n';
          }

          return source;
        }

        function getSearchPattern(tagCategory) {

          if (tagCategory === 'link') {
            return /<\s*\/\s*head\s*>/;
          } 
          else if (tagCategory === 'script'){
            return /<\s*\/\s*body\s*>/;
          }
        }

        function findIndexWhereToInsertCode(code, tagCategory) {
          var searchPattern = getSearchPattern(tagCategory);
          var match = code.match(searchPattern);

          if (match) {
            return code.indexOf((match[0])); 
          }
          return code.length;
        }

        var codeToInsert = getCodeToInsert(library.source, library.tagCategory);
        var insertIndex = findIndexWhereToInsertCode(code, library.tagCategory);
        self.activeTab.content = insertToString(code, insertIndex, codeToInsert);
        self.onRefreshContent();
      };

      self.whenHtmlFile = function(activeTabName) {
        var activeTabExtension = activeTabName.split('|').slice(-1)[0]; 
        var allowedExtensions = ['html', 'htm'];

        if ( _.include(allowedExtensions, activeTabExtension) ) {
          return true;
        }
        return false;
      };
 
    }
  };

});
