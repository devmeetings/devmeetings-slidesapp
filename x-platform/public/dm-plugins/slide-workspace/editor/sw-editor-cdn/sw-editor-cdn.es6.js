/* jshint esnext:true,-W097 */
'use strict';

import sliderPlugins from 'slider/slider.plugins';
import * as module from 'module';
import * as _ from '_';
import getExtension from 'es6!dm-modules/dm-editor/get-extension.es6';


String.prototype.insert = function (index, string) {
  if (index > 0)
    return this.substring(0, index) + string + this.substring(index, this.length);
  else
    return string + this;
};


sliderPlugins.directive('swEditorCdn', ($log, $timeout) => {

  return {
    restrict: 'E',
    scope: {
      activeTab: '=',
      activeTabName: '=',
      onNewWorkspace: '&',
      onRefreshContent: '&'
    },
    bindToController: true,
    controllerAs: 'cdn',
    templateUrl: '/static/dm-plugins/slide-workspace/editor/sw-editor-cdn/sw-editor-cdn.html',
    controller: function($scope) {
      let self = this;

      self.libraries = [
        { 
          'name':'jQuery',
          'source':'https://cdnjs.cloudflare.com/ajax/libs/jquery/2.1.4/jquery.min.js',
          'tag_category':'script'
        },
        { 
          'name':'AngularJS',
          'source':'https://ajax.googleapis.com/ajax/libs/angularjs/1.3.14/angular.min.js',
          'tag_category':'script'
        },
        { 
          'name':'Bootstrap (JS)',
          'source':'https://maxcdn.bootstrapcdn.com/bootstrap/3.3.4/js/bootstrap.min.js',
          'tag_category':'script'
        },
        { 
          'name':'Bootstrap (CSS)',
          'source':'https://maxcdn.bootstrapcdn.com/bootstrap/3.3.4/css/bootstrap.min.css',
          'tag_category':'link'
        }
      ];

      self.selectLibrary = function(library) {
        var code = self.activeTab.content;

        function getCodeToInsert(source, tagCategory) {
          if (tagCategory === 'link') 
          {
            return '<link href="'+source+'" rel="stylesheet">\n';
          } 
          
          if (tagCategory === 'script')
          {
            return '<script src="'+source+'"></script>\n';
          }

          return source;
        }

        function getSearchPattern(tagCategory) {
          if (tagCategory === 'link') 
          {
            return /<\s*\/\s*head\s*>/;
          } 
          else if (tagCategory === 'script')
          {
            return /<\s*\/\s*body\s*>/;
          }
        }

        function findIndexWhereToInsertCode(code, tagCategory) {
          var searchPattern = getSearchPattern(tagCategory);
          var match = code.match(searchPattern);

          if (match) {
            $log.log(code.indexOf(match[0]));
            return code.indexOf((match[0])); 
          }
          return code.length;
        }

        var codeToInsert = getCodeToInsert(library.source, library.tag_category);
        var insertIndex = findIndexWhereToInsertCode(code, library.tag_category);

        self.activeTab.content = code.insert(insertIndex, codeToInsert);e;
        self.onRefreshContent();
      };
 
    }
  };

});
