'use strict';

var Sockets = {
    sendEveryChange: false,
    socket: io.connect(SOCKET_URL),
};
// sockets
(function() {
    // send name on start
    (function(){
        var name = localStorage.getItem('name');
        Sockets.socket.emit('name', name);
    }());
    // enable live sending
    Sockets.socket.on('send live', function(sendEveryChange) {
        Sockets.sendEveryChange = sendEveryChange;
    });
}());


// handling
(function() {
    var Slides = {
        slides: null,
        slidesOrder: null,
        trainersWindow: null,

        openTrainersWindow: function() {
            this.trainersWindow = window.open('/trainer', 'trainersWindow', 'status=0,toolbar=0,location=0,menubar=0');
            // trigger event for popup
            setTimeout(function() {
                this.slideChanged(this.getCurrentSlide());
            }.bind(this), 2000);

            window.onbeforeunload = function() {
                this.trainersWindow.close();
            }.bind(this);
        },
        getCurrentSlide: function() {
            var hash = window.location.hash;
            return this.slides[hash.replace('#', '')];
        },
        goToSlide: function(slide) {
            if (!slide) {
                return
            }
            window.location.hash = '#';
            window.location.hash = '#' + slide.id;
        },
        slideChanged: function(slide) {
            var nextSlide = this.slidesOrder[slide.order + 1];
            if (this.trainersWindow) {
                this.trainersWindow.postMessage({
                    type: 'slideupdate',
                    currentSlide: slide,
                    nextSlide: nextSlide
                }, window.location);
            }
        }
    };

    $.get('/slides/' + window.presentation + '.yaml').then(function(yaml) {
        var presentation = jsyaml.load(yaml);
        Slides.slides = {};
        Slides.slidesOrder = {};
        presentation.slides.map(function(slide, i) {
            //add to map by id
            Slides.slides[slide.id] = slide;
            slide.order = i;
            Slides.slidesOrder[i] = slide;
        });

        // GUI
        // fix title
        $('title').text(presentation.title);
        // fill out slides list
        var $menu = $('ul.nav.nav-slides').empty();

        var slideLink = function(slide, inGroup) {
            var tooltip = inGroup ? '' : 'tooltip';
            var $a = $('<a data-toggle="' + tooltip + '" data-placement="bottom"/>');
            $a.attr('href', '#' + slide.id);
            $a.attr('title', slide.title);
            var text = inGroup ? slide.title : slide.name;
            $a.text((slide.idx + 1) + ". " + text);
            return $a;
        };

        presentation.slides.reduce(function(memo, slide, idx) {
            var last = memo[memo.length - 1];
            slide.idx = idx;

            if (last && last[0].name === slide.name) {
                last.push(slide);
            } else {
                memo.push([slide]);
            }
            return memo;
        }, []).map(function(grouppedSlides, idx) {
            var slide = grouppedSlides[0];
            if (grouppedSlides.length === 1) {
                var $a = slideLink(slide);
                $menu.append($('<li />').append($a));
            } else {
                var $a = $('<a class="dropdown-toggle" data-toggle="dropdown" />');
                $a.text(slide.name + " ");
                $a.append($('<b />').addClass('caret'));

                var $ul = $('<ul />').addClass('dropdown-menu');
                grouppedSlides.map(function(slide) {
                    var $a = slideLink(slide, true);
                    $ul.append($('<li />').append($a));
                });

                $menu.append($('<li />').addClass('dropdown').append($a).append($ul));
            }
        });

        $menu.css({
            'white-space': 'nowrap'
        }).slimScrollHorizontal({
            color: '#fff',
            height: '60px',
            width: 'calc(100% - 70px)',
            alwaysVisible: false,
            start: 'left',
            position: 'top',
            wheelStep: 10,
            size: '3px'
        })

        // Some hacking to make tooltips and dropdown menus working
        $menu.css({
            'height': '300px'
        }).parent().css({
            'overflow-x': 'visible',
            'overflow-y': 'visible',
        });

        var $confirmDialog = $('.trainers-mode-confirm');
        var $input = $('.trainers-mode-password');
        $('.trainers-mode').on('click', function(ev) {
            ev.preventDefault();
            $confirmDialog.on('shown.bs.modal', function() {
                $input.focus();
            }).modal();
        });
        var enterTrainersMode = function(ev) {
            ev.preventDefault();
            var pass = $input.val();
            if (pass === presentation.trainersSecret) {
                $confirmDialog.modal('hide');
                // Activate trainers window
                Slides.openTrainersWindow();
            } else {
                $input.parent('.form-group').addClass('has-error');
            }
            return false;
        };
        $confirmDialog.on('submit', 'form', enterTrainersMode);
        $confirmDialog.on('click', '.btn-primary', enterTrainersMode);
        // detect if it is refresh
        var slide = Slides.getCurrentSlide();
        if (slide === undefined) {
            // go to first slide
            Slides.goToSlide(presentation.slides[0]);
        } else {
            Slides.goToSlide(slide);
        }
    });



    var $body = $('body').addClass('loaded');
    var $iframe = $('iframe');

    var displaySlide = function(slideId) {
        Sockets.socket.emit('currentSlide', slideId, window.presentation);
        var newSrc = '/slides-' + window.presentation + ':' + slideId;
        $iframe[0].src = newSrc;
    };

    // display solution to everyone
    Sockets.socket.on('solution', function(solutionId) {
        displaySlide(solutionId);
    });

    var _ignoreHashChange = false;

    window.addEventListener('hashchange', function(ev) {
        var hash = window.location.hash;
        var $link = $('a[href=' + hash + ']');
        $link.parents('ul').find('li.active').removeClass('active');
        $link.parent().addClass('active');
        $link.parents('li').addClass('active');

        var $menu = $('ul.nav.nav-slides');
        var of = $link.parents('li:visible').offset();
        if (!of) {
            of = $link.parents('li').offset() || {
                left: 0
            };
        }
        $menu.slimScrollHorizontal({
            scroll: of.left - $(document).width() / 3
        });

        if (_ignoreHashChange) {
            _ignoreHashChange = false;
            return;
        }

        var slide = Slides.getCurrentSlide();
        displaySlide(slide.id);
        Slides.slideChanged(slide);
    });

    var changeSlide = function(mod, ev) {
        var slide = Slides.getCurrentSlide();
        var newSlide = Slides.slidesOrder[slide.order + mod];
        Slides.goToSlide(newSlide);
        if (ev) {
            ev.preventDefault();
        }
    };

    var changeIframeClass = function() {
        $iframe.contents().find('body').toggleClass('projector', $body.hasClass('projector'))
    };
    var fixIframeSize = function fixIframeSize() {
        var height = $iframe.contents().find('body').height();
        $iframe.css({
            height: height + 100
        });
        // And do it once again after soem images might load
        setTimeout(fixIframeSize, 2000);
    };
    $iframe.on('load', changeIframeClass);
    $iframe.on('load', fixIframeSize);

    // Controls handling
    (function() {

        var next = $('.ctrl-next'),
            previous = $('.ctrl-prev');
        var projector = $('.ctrl-proj');
        var slowmo = $('.ctrl-slowmo');

        projector.on('click', function() {
            $body.toggleClass('projector');
            changeIframeClass();
            fixIframeSize();
        });
        var nextSlide = changeSlide.bind(null, 1);
        var prevSlide = changeSlide.bind(null, -1);
        next.on('click', nextSlide);
        previous.on('click', prevSlide);

        var $doc = $(document);
        $doc.bind('keyup', 'right', nextSlide);
        $doc.bind('keyup', 'space', nextSlide);
        $doc.bind('keyup', 'down', nextSlide);
        $doc.bind('keyup', 'pagedown', nextSlide);

        $doc.bind('keyup', 'up', prevSlide);
        $doc.bind('keyup', 'pageup', prevSlide);
        $doc.bind('keyup', 'left', prevSlide);


        window.addEventListener('message', function(ev) {
            if (ev.data.type === 'editorupdate') {
                if (Sockets.sendEveryChange) {
                    Sockets.socket.emit('code change', ev.data.data);
                }
            }
            if (ev.data.type === 'codeupdate') {
                slowmo.attr('href', 'http://toolness.github.io/slowmo-js/?code=' + encodeURIComponent(ev.data.code));
            }
            if (ev.data.type === 'navcanceled') {
                _ignoreHashChange = true;
                window.history.go(-2); //skip change to "#"
            }
            if (ev.data.type === 'tasksolution') {
                displaySlide(ev.data.solutionId);
            }
            if (ev.data.type === 'changeslide') {
                changeSlide(ev.data.mod);
            }
            if (ev.data.type === 'microtasks') {
                Sockets.socket.emit('microtasks', {
                    slideId: Slides.getCurrentSlide().id,
                    microtasks: ev.data.data
                });
            }
        });
    }());


    // Enable tooltips
    $body.tooltip({
        selector: '[data-toggle="tooltip"]'
    });
}());