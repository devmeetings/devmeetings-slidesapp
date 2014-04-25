define(['angular', './slider.plugins', "angular-bootstrap", "angular-animate"], function(angular) {
    return angular.module('slider', ['slider.plugins', 'ui.bootstrap', 'ngAnimate']);
});
