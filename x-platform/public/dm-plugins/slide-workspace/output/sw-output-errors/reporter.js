(function(displayErrorInfo) {

    var originalError = window.onerror;
    function invokeOriginalError(args) {
      if (!originalError) {
        return;
      }

      try {
        originalError.apply(null, args);
      } catch (e) {
        console.error(e);
      }
    }

    function handleError(msg, file, line, col, error) {
      var err = normalizeError(msg, error);
      if (window.parent) {
        forwardErrorToParent(err);
      } else {
        displayErrorInfo(err);
      }
    }

    function normalizeError(msg, error) {
      try {
        return {
          msg: error.message || msg,
          stack: error.stack.split("\n") || []
        };
      } catch(e) {
        console.warn(e);
        return {
          msg: msg,
          exc: e
        };
      }
    }

    function forwardErrorToParent(err) {
      displayErrorInfo(err);
    }

    window.onerror = function(/*args*/) {
      var args = [].slice.apply(arguments);
      invokeOriginalError(args);
      handleError.apply(null, args);
    };

}(function displayErrorInfo(err) {
  function $(sel) {
    return document.querySelector(sel);
  }

  function $el(sel) {
    var d = sel.split('.');
    var $e = document.createElement(d[0]);
    $e.className = d.slice(1).join(' ');
    return $e;
  }

  function injectStyles() {
    function asStyles(selector, obj) {
      var str = selector + '{\n';
        for (var key in obj) {
          if (obj.hasOwnProperty(key)) {
            str += '\t' + key + ': ' + obj[key] + ';\n';
          }
        }
        return str + '}\n';
    }
    var $e = $el('style');
    $e.innerHTML = [
      asStyles('.xpla-error-dialog, .xpla-error-dialog *', {
          'padding': '0',
          'margin': '0',
          'font-family': 'sans-serif',
          'font-size': '12px',
          'color': '#FF0000',
          'display': 'block',
          'visibility': 'visible',
          'opacity': '1.0'
      }),
      asStyles('.xpla-error-dialog', {
          'position': 'fixed',
          'bottom': '0',
          'right': '0',
          'width': 'auto',
          'max-width': '100%',
          'overflow': 'auto',
          'padding': '10px',
          'background-color': '#FFEFEF',
      }),
      asStyles('.xpla-error-link, .xpla-error-link:visited, .xpla-error-dialog-close', {
          'text-decoration': 'none',
          'cursor': 'pointer',
          'color': '#545454',
          'display': 'inline'
      }),
      asStyles('.xpla-error-link:hover', {
          'text-decoration': 'underline',
          'color': "#242424"
      }),
      asStyles('.xpla-error-dialog-close', {
          'position': 'absolute',
          'top': 0,
          'right': 0,
          'display': 'block',
          'color': 'red'
      }),
      asStyles('.xpla-error-details', {
          'display': 'none'
      }),
      asStyles('.xpla-error-details.visible', {
          'display': 'block'
      }),
      asStyles('.xpla-error-item, .xpla-error-item *', {
        'font-family': 'monospace'
      }),
      asStyles('.xpla-error-item', {
        'padding': '3px 0',
        'margin-top': '3px',
        'border-top': '1px solid red'
      }),
      asStyles('.xpla-error-item p', {
        'padding': '3px 10px',
        'color': '#333'
      }),
      asStyles('.xpla-error-item pre', {
        'padding': '10px',
        'color': '#333',
        'border': '1px solid #444',
        'background-color': '#eee'
      })
    ].join('');
    document.head.appendChild($e);
  }

  function getErrorsList() {
    if (!window.xplaLastErrors) {
      window.xplaLastErrors = [];
    }
    return window.xplaLastErrors;
  }

  function updateDetails(errorList) {
    var $link = $('.xpla-error-link');
    $link.innerHTML = 'Details (' + errorList.length + ')';
    // Build details
    var $details = $('.xpla-error-details');
    errorsList.map(function(err) {
      var $e = $el('div.xpla-error-item');
      var $p = $el('p');
      var $pre = $el('pre');

      $p.innerHTML = err.msg;
      try {
        $pre.innerHTML = JSON.stringify(err.stack, null, 2);
      } catch (e) {}
      $e.appendChild($p);
      $e.appendChild($pre);
      return $e;
    }).map(function($e){
    $details.appendChild($e);
    });
  }

  function createDetailsLink($detailsContainer) {
    var $link = $el('a.xpla-error-link');
    $link.addEventListener('click', function() {
      $detailsContainer.classList.toggle('visible');
    });
    return $link;
  }

  function createDetailsContainer() {
    var $details = $el('div.xpla-error-details');
    return $details;
  }

  function createCloseLink($err) {
    var $link = $el('a.xpla-error-dialog-close');
    $link.innerHTML = '&times;';
    $link.addEventListener('click', function(){
      document.body.removeChild($err);
    });
    return $link;
  }

  var errorsList = getErrorsList();
  errorsList.push(err);

  if ($('.xpla-error-dialog')) {
    // TODO [ToDr] report new error?
    updateDetails(errorList);
    return;
  }

  injectStyles();

  var $detailsContainer = createDetailsContainer();
  var $detailsLink = createDetailsLink($detailsContainer);
  var $err = $el('div.xpla-error-dialog');
  var $closeLink = createCloseLink($err);

  $err.innerHTML = 'There is an error in your application. You might want to check the console.&nbsp;';
  $err.appendChild($closeLink);
  $err.appendChild($detailsLink);
  $err.appendChild($detailsContainer);
  document.body.appendChild($err);
  updateDetails(errorsList);
}));