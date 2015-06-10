/* jshint esnext:true,-W097 */
'use strict';

import getExtension from 'es6!dm-modules/dm-editor/get-extension.es6';
import * as require from 'require';


let hasFormatting = {
  'css': true,
  'js': true,
  'html': true
};

class Formatter {

  hasFormattingForName(tabName) {
    let ext = getExtension(tabName);
    return hasFormatting[ext];
  }

  format(tabName, tabContent, callback) {
    require(['js-beautify'], (jsBeautify) => {
      let ext = getExtension(tabName);
      callback(jsBeautify[ext](tabContent, {
        indent_size: 2
      }));
    });
  }
}





export default new Formatter();
