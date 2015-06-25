/* jshint esnext:true,-W097 */

'use strict';

function newListenable () {
  let listeners = {
    'newId': [],
    'onSync': [],
    'newState': [],
    'newWorkspace': []
  };

  return {
    trigger( evName, id) {
      var list = listeners[evName];
      list.map(cb => cb(id));
    },

    listen( evName, cb) {
      listeners[evName].push(cb);

      return function removeListener () {
        var toRemove = listeners[evName].indexOf(cb);
        if (toRemove === -1) {
          return;
        }
        listeners[evName].splice(toRemove, 1);
      };
    }

  };
}

export default newListenable;
