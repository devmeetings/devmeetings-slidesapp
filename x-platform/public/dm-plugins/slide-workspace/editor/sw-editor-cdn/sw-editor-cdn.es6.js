/* jshint esnext:true,-W097 */
'use strict';

import sliderPlugins from 'slider/slider.plugins';



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
          "name":"jQuery",
          "source":"https://cdnjs.cloudflare.com/ajax/libs/jquery/2.1.4/jquery.min.js",
          "tagCategory":"script"
        },
        { 
          "name":"AngularJS",
          "source":"https://ajax.googleapis.com/ajax/libs/angularjs/1.3.14/angular.min.js",
          "tagCategory":"script"
        },
        { 
          "name":"Bootstrap (JS)",
          "source":"https://maxcdn.bootstrapcdn.com/bootstrap/3.3.4/js/bootstrap.min.js",
          "tagCategory":"script"
        },
        { 
          "name":"Bootstrap (CSS)",
          "source":"https://maxcdn.bootstrapcdn.com/bootstrap/3.3.4/css/bootstrap.min.css",
          "tagCategory":"link"
        }
      ];

      function insertToString(input, index, string) {

        if (index > 0) {
          return input.substring(0, index) + string + input.substring(index, input.length);
        } else {
          return string + input;
        } 
      }

      function include(arr, obj) {

        for(var i=0; i<arr.length; i++) {
          if (arr[i] == obj) return true;
        }
      }

      self.getLibraries = function() {

        if ( this.cdnLibraries.libraries && this.cdnLibraries.libraries.length >= 1 ) {
          return this.cdnLibraries.libraries;
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
        var AllowedExtensions = ['html', 'htm'];

        if ( include(AllowedExtensions, activeTabExtension) ) {
          return true;
        }
        return false;
      };
 
    }
  };

});
