/* jshint esnext:true,-W097 */
'use strict';

export default function getExtension (name) {
  name = name || '';
  var name2 = name.split('|');
  return name2[name2.length - 1];
}
