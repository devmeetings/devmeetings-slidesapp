define(['slider/slider.plugins'], function(sliderPlugins) {
    sliderPlugins.registerPlugin('trainer', 'notes', 'trainer-notes', 1).directive('trainerNotes', [

        function() {
            return {
                restrict: 'E',
                scope: {
                    notes: '=data',
                    slide: '=context'
                },
                template: '<pre ng-bind-html="notes">Hello!</pre>'
            };
        }
    ]);
});