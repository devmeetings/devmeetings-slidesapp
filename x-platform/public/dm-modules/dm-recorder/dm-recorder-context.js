/* jshint esnext:true,-W097 */
'use strict';

import _ from '_';


class RecorderContext {

  constructor(data) {
    _.extend(this, data);
  }

  link() {

  }

  controller(self) {
    self.getRecorder = () => {
      return this.recorder;
    };
  }

  createRecorder(workspaceId) {
    this.recorder = this.dmRecorder(workspaceId);
    this.recorder.workspaceId = workspaceId;
    return this.recorder;
  }
}


export default function(dmRecorder) {

  let recorderContext = new RecorderContext({
    dmRecorder
  });

  return {
    restrict: 'E',
    scope: {
      recorder: '=',
      workspaceId: '='
    },
    controller: function($scope) {
      recorderContext.controller(this);

      $scope.$watch('workspaceId', (wId) => {
        $scope.recorder = recorderContext.createRecorder(wId);
      });
    },
    link(scope, element) {
      recorderContext.link(scope, element);
     }
  };
}
