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
            window.location.hash = '#'+slide.id;
        },
        slideChanged: function(slide) {
            var notes = slide.notes;
            var nextSlide = this.slidesOrder[slide.order + 1];
            if (this.trainersWindow) {
                this.trainersWindow.postMessage({
                    type: 'slideupdate',
                    notes: notes,
                    slide: nextSlide
                }, window.location);
            }
        }
    };

    $.get('/slides/'+window.presentation+'.yaml').then(function(yaml) {
        var presentation = jsyaml.load(yaml);
        Slides.slides = {};
        Slides.slidesOrder = {};
        presentation.slides.map(function(slide, i){
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
        presentation.slides.map(function(slide){
            var $a = $('<a data-toggle="tooltip" data-placement="bottom"/>');

            $a.attr('href', '#'+slide.id);
            $a.attr('title', slide.title);
            $a.text(slide.name);

            $menu.append($('<li />').append($a));
        });

        var $confirmDialog = $('.trainers-mode-confirm');
        var $input = $('.trainers-mode-password');
        $('.trainers-mode').on('click', function(ev) { 
            ev.preventDefault();
            $confirmDialog.on('shown.bs.modal', function(){
                $input.focus();
            }).modal();
        });
        $confirmDialog.on('click', '.btn-primary', function(){
            var pass = $input.val();
            if (pass === presentation.trainersSecret) {
                $confirmDialog.modal('hide');
                // Activate trainers window
                Slides.openTrainersWindow();
            } else {
                $input.parent('.form-group').addClass('has-error');
            }
        });
        // go to first slide
        Slides.goToSlide(presentation.slides[0]);
    });



    var $body = $('body').addClass('loaded');
    var $iframe = $('iframe');
    
    window.addEventListener('hashchange', function() {
        var hash = window.location.hash;
        var $link = $('a[href='+hash+']');
        $link.parents('ul').find('li.active').removeClass('active');
        $link.parent().addClass('active');

        var slide = Slides.getCurrentSlide();
    	$iframe[0].src = '/slide?slide='+encodeURIComponent(JSON.stringify(slide));
        Slides.slideChanged(slide);
    });

    var changeSlide = function(mod) {
        var slide = Slides.getCurrentSlide();
        var newSlide = Slides.slidesOrder[slide.order + mod];
        Slides.goToSlide(newSlide);
    };

    var changeIframeClass = function() {
        $iframe.contents().find('body').toggleClass('projector', $body.hasClass('projector'))
    };
    $iframe.on('load', changeIframeClass);

    // Controls handling
    (function() {

        var next = $('.ctrl-next'), previous = $('.ctrl-prev');
        var projector = $('.ctrl-proj');
        var slowmo = $('.ctrl-slowmo');

        projector.on('click', function() {
            $body.toggleClass('projector');
            changeIframeClass();
        });
        next.on('click', changeSlide.bind(null, 1));
        previous.on('click', changeSlide.bind(null, -1));

        window.addEventListener('message', function(ev) {
            if (ev.data.type === 'codeupdate') {
                slowmo.attr('href', 'http://toolness.github.io/slowmo-js/?code='+encodeURIComponent(ev.data.code));
            }
        });
    }());


    // Enable tooltips
    $body.tooltip({
        selector: '[data-toggle="tooltip"]'
    });
}());