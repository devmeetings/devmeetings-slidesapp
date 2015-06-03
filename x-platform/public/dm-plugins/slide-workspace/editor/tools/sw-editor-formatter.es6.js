/* jshint esnext:true,-W097 */
'use strict';

import jsBeautify from 'js-beautify';
import getExtension from 'dm-modules/dm-editor/get-extension.es6';

class Formatter {

  hasFormattingForName(tabName) {
    let ext = getExtension(tabName);
    return !!jsBeautify[ext];
  }

  format(tabName, tabContent) {
    let ext = getExtension(tabName);
    return jsBeautify[ext](tabContent, {
      indent_size: 2
    });
  }
}





export default new Formatter();
