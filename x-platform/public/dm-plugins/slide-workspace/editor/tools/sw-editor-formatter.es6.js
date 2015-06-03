/* jshint esnext:true,-W097 */
'use strict';

import * as jsBeautify from 'js-beautify';
import getExtension from 'es6!dm-modules/dm-editor/get-extension.es6';

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
