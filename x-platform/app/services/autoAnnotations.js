var cache = require('./cache');

module.exports = generateAutoAnnotationsForUnifiedHistoryFormat;

function generateAutoAnnotationsCached(recording) {
  'use strict';

  if (recording.cacheKey) {
    return cache.get(recording.cacheKey, function() {
      return generateAutoAnnotationsForUnifiedHistoryFormat(recording);
    });
  }

  return generateAutoAnnotationsForUnifiedHistoryFormat(recording);
}


function generateAutoAnnotationsForUnifiedHistoryFormat(recording) {
  'use strict';

  // [ToDr] Included here because of circular dependencies.
  var states = require('./states');

  var start = {
    annotations: [],
    active: null,
    timestamp: 0,
    permaUrl: null,
    movement: 0,
    previousNotes: null,
    previousChatnotes: [],
    previousTabData: {
      content: '',
      editor: null
    }
  };

  var lastIdx = recording.patches.length - 1;

  return states.reducePatchesContent(recording, function(memo, slide, idx) {
    if (!slide.current || !slide.current.workspace) {
      return memo;
    }

    slide.code = slide.current;
    var workspace = slide.code.workspace;

    if (workspace.active !== memo.active) {
      var currentTime = slide.timestamp;
      slide.timestamp = memo.timestamp + 500;
      pushAnno(memo, slide, 'beforeTab: ' + workspace.active + ', ' + memo.active);
      // After the switch
      slide.timestamp = currentTime + 300;
      // [ToDr] prevent removing 
      pushAnno(memo, slide, 'afterTab', '');

      memo.active = workspace.active;
      memo.movement = 0;
    } else if (workspace.permaUrl !== memo.permaUrl) {
      pushAnno(memo, slide, 'urlChange: ' + workspace.permaUrl + ', ' + memo.permaUrl);
      memo.permaUrl = workspace.permaUrl;
      memo.movement = 0;
    } else if (Math.abs(slide.timestamp - memo.timestamp) > 5000) {
      pushAnno(memo, slide, 'longPause: ' + (slide.timestamp - memo.timestamp));
      memo.movement = 0;
    } else if (movementDetected(memo, slide)) {
      pushAnno(memo, slide, 'movement');
      memo.movement = 0;
    } else if (largeJumpDetected(memo, slide)) {
      pushAnno(memo, slide, 'largeJump');
    } else if (notesDetected(memo, slide)) {
      var note = notesDetected(memo, slide);
      pushAnno(memo, slide, 'Notes', note);
    } else if (chatNotesDetected(memo, slide)) {
      var chatNote = chatNotesDetected(memo, slide);
      pushAnno(memo, slide, 'Chat Notes', chatNote);
    } else if (lastIdx === idx) {
      pushAnno(memo, slide, 'last');
    }

    memo.previousTabData = workspace.tabs[workspace.active];
    memo.previousNotes = slide.code.notes;
    memo.previousChatnotes = slide.code.chatnotes;
    memo.timestamp = slide.timestamp;
    return memo;

  }, start).then(function(memo) {

    return memo.annotations.sort(function(a, b) {
      return a.timestamp - b.timestamp;
    }).reduce(function(memo, anno) {
      if (!memo.length) {
        return [anno];
      }
      var last = memo[memo.length - 1];

      if (Math.abs(last.timestamp - anno.timestamp) > 1.5 || (anno.reason === 'afterTab' && anno.timestamp !== 0)) {
        return memo.concat([anno]);
      }
      return memo;
    }, []);

  });
}



function pushAnno(memo, slide, reason, description) {
  'use strict';
  description = description || '';
  var anno = {
    description: description,
    timestamp: Math.max(0, (slide.timestamp - 1300) / 1000),
    type: 'comment',
  };
  if (reason) {
    anno.reason = reason;
  }
  memo.annotations.push(anno);
}


function notesDetected(memo, slide) {
  'use strict';
  if (!slide.code.notes) {
    return false;
  }

  var lastNotes = slide.code.notes.split('\n');
  var prevNotes = memo.previousNotes.split('\n');

  // Naive detecting of new line
  if (lastNotes.length === prevNotes.length) {
    return false;
  }

  return lastNotes[lastNotes.length - 2];
}
function chatNotesDetected(memo, slide) {
  'use strict';
  if (!slide.code.chatnotes) {
    return false;
  }
  var currentNotes = slide.code.chatnotes.notes;
  var prevNotes = memo.previousChatnotes;

  if (currentNotes.length === prevNotes.length) {
    return false;
  }

  return currentNotes[currentNotes.length - 1];
}

function movementDetected(memo, slide) {
  'use strict';
  var workspace = slide.code.workspace;
  var active = workspace.active;
  var tab = workspace.tabs[active];

  if (!tab || !memo.previousTabData) {
    return false;
  }

  if (tab.editor && memo.previousTabData.editor) {
    var isContentSame = tab.content === memo.previousTabData.content;
    var isCursorDifferentColumn = tab.editor.cursorPosition.column !== memo.previousTabData.editor.cursorPosition.column;
    var isCursorDifferentRow = tab.editor.cursorPosition.row !== memo.previousTabData.editor.cursorPosition.row;
    if (isContentSame && (isCursorDifferentColumn || isCursorDifferentRow)) {
      memo.movement++;
    } else {
      memo.movement = 0;
    }
  }

  if (memo.movement > 5) {
    return true;
  }
  return false;
}

function largeJumpDetected(memo, slide) {
  'use strict';

  var workspace = slide.code.workspace;
  var active = workspace.active;
  var tab = workspace.tabs[active];

  function getRow(tab) {
    if (!tab.editor || !tab.editor.cursorPosition) {
      return null;
    }
    return tab.editor.cursorPosition.row;
  }

  if (!tab) {
    return false;
  }

  var lastRow = getRow(memo.previousTabData);
  var currentRow = getRow(tab);

  // TODO [ToDr] Amount choose after some serious big data analysisi ;)
  if (Math.abs(lastRow - currentRow) > 10) {
    return true;
  }

  return false;
}
