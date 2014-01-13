'use strict';

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
        presentation.slides.map(function(slide, idx) {
            var $a = $('<a data-toggle="tooltip" data-placement="bottom"/>');

            $a.attr('href', '#' + slide.id);
            $a.attr('title', slide.title);
            $a.text((idx + 1) + ". " + slide.name);

            $menu.append($('<li />').append($a));
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

    var displaySlide = function(slide) {
        $iframe[0].src = '/slide?slide=' + encodeURIComponent(JSON.stringify(slide));
    };

    window.addEventListener('hashchange', function() {
        var hash = window.location.hash;
        var $link = $('a[href=' + hash + ']');
        $link.parents('ul').find('li.active').removeClass('active');
        $link.parent().addClass('active');
        var $menu = $('ul.nav.nav-slides');
        $menu.slimScrollHorizontal({
            scroll: $link.offset().left - $link.width() * 3
        });

        var slide = Slides.getCurrentSlide();
        displaySlide(slide);
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
    $iframe.on('load', changeIframeClass);

    // Controls handling
    (function() {

        var next = $('.ctrl-next'),
            previous = $('.ctrl-prev');
        var projector = $('.ctrl-proj');
        var slowmo = $('.ctrl-slowmo');

        projector.on('click', function() {
            $body.toggleClass('projector');
            changeIframeClass();
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
            if (ev.data.type === 'codeupdate') {
                slowmo.attr('href', 'http://toolness.github.io/slowmo-js/?code=' + encodeURIComponent(ev.data.code));
            }
            if (ev.data.type === 'tasksolution') {
                displaySlide(ev.data.solution);
            }
            if (ev.data.type === 'changeslide') {
                changeSlide(ev.data.mod);
            }
        });
    }());


    // Enable tooltips
    $body.tooltip({
        selector: '[data-toggle="tooltip"]'
    });
}());