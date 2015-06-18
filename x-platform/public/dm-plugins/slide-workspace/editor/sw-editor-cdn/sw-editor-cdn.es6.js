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

      function insertToString(input, index, string) {

        if (index > 0) {
          return input.substring(0, index) + string + input.substring(index, input.length);
        } else {
          return string + input;
        } 

      }

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

        var codeToInsert = getCodeToInsert(library.source, library.tag_category);
        var insertIndex = findIndexWhereToInsertCode(code, library.tag_category);
        self.activeTab.content = insertToString(code, insertIndex, codeToInsert);
        self.onRefreshContent();
      };
 
    }
  };

});
