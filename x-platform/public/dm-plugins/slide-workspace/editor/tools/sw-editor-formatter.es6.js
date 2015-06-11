/* jshint esnext:true,-W097 */
'use strict';

import getExtension from 'es6!dm-modules/dm-editor/get-extension.es6';
import * as require from 'require';


let hasFormatting = {
  'css': 'css',
  'js': 'js',
  'html': 'html',
  'es6': 'js'
};

class Formatter {

  hasFormattingForName(tabName) {
    let ext = getExtension(tabName);
    return hasFormatting[ext];
  }

  format(tabName, tabContent, callback) {
    require(['js-beautify'], (jsBeautify) => {
      let ext = getExtension(tabName);
      let formatter = hasFormatting[ext];
      callback(jsBeautify[formatter](tabContent, {
        indent_size: 2
      }));
    });
  }
}





export default new Formatter();
