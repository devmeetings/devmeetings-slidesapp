(function() {
    var q = function(sel) {
        return document.querySelector(sel);
    };
    var onClick = function(el, callback) {
        return el.addEventListener('click', callback);
    };

    var $body = $('body').addClass('loaded');
    var $iframe = $('iframe');
    

    window.addEventListener('hashchange', function() {
    	console.log("New hash", window.location.hash);
    	$iframe[0].src = window.location.hash.replace('#', 'slides-')+".html";
    });

    var changeIframeClass = function() {
        $iframe.contents().find('body').toggleClass('projector', $body.hasClass('projector'))
    };
    $iframe.on('load', changeIframeClass);

    // Controls handling
    (function() {
        var next = q('.ctrl-next'), previous = q('.ctrl-previous');
        var projector = q('.ctrl-proj');
        var slowmo = q('.ctrl-slowmo');

        onClick(projector, function() {
            $body.toggleClass('projector');
            changeIframeClass();
        });

        window.addEventListener('message', function(ev) {
            slowmo.href = 'http://toolness.github.io/slowmo-js/?code='+encodeURIComponent(ev.data);
        });
    }());


    // Enable tooltips
    $body.tooltip({
        selector: '[data-toggle="tooltip"]'
    });
}());