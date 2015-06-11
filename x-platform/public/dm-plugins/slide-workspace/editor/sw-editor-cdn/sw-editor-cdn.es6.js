/* jshint esnext:true,-W097 */
'use strict';

//gosc ze stack'a napisal ten prototyp do Stringow, nie widzialem, gdzie
//takie rzeczy zamieszczac, wiec dalem na samej gorze
String.prototype.insert = function (index, string) {
  if (index > 0)
    return this.substring(0, index) + string + this.substring(index, this.length);
  else
    return string + this;
};

import sliderPlugins from 'slider/slider.plugins';
import * as module from 'module';
import * as _ from '_';
import getExtension from 'es6!dm-modules/dm-editor/get-extension.es6';




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
        //$log.log(library);
        //$log.log(self.activeTab);
        //$log.log(self.activeTab.content);
        //$log.log(self.activeTabName);
        var code = self.activeTab.content.toString();

        if ( code.toLowerCase().includes('</body>') && library.tag_category === 'script' ) 
        {
          var indexOfBodyClose = code.toLowerCase().indexOf('</body>');
          code = code.insert(indexOfBodyClose, '<script src="'+library.source+'"></script>\n');
        }
        else if ( code.toLowerCase().includes('</head>') && library.tag_category === 'link' ) 
        {
          var indexOfHeadClose = code.toLowerCase().indexOf('</head>');
          code = code.insert(indexOfHeadClose, '<link href="'+library.source+'">\n');
        }
        else 
        { 
          if ( library.tag_category === 'script' ) 
          {
            code += '<script src="'+library.source+'"></script>\n';
          }
          else if ( library.tag_category === 'link' )
          {
            code += '<link href="'+library.source+'">\n';
          }
        }
        
        //$log.log(code);
        self.activeTab.content = code;
        self.onRefreshContent();
      };

      self.forceDropdownToBeOpen = function() {
        $timeout( () => {
          $('.cdn-dropdown').addClass('open');
        }, 50);
      }

    }
  };

});
