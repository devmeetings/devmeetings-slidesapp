/* jshint esnext:true,-W097 */
/* globals System:true */
'use strict';

import getExtension from 'dm-modules/dm-editor/get-extension.es6';

let hasFormatting = {
  'css': 'css',
  'js': 'js',
  'html': 'html',
  'es6': 'js'
};

class Formatter {

  hasFormattingForName( tabName) {
    let ext = getExtension(tabName);
    return hasFormatting[ext];
  }

  format( tabName, tabContent, callback) {
    let ext = getExtension(tabName);
    let formatter = hasFormatting[ext];
    System.import('js-beautify/beautify-' + formatter).then((jsBeautify) => {
      let func = jsBeautify[formatter + '_beautify'];
      callback(func(tabContent, {
        indent_size: 2
      }));
    });
  }
}

export default new Formatter();
