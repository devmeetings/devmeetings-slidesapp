define(['module', 'slider.plugins'], function(module, plugins) {
    var path = plugins.extractPath(module);


    plugins.directive('presentationLayoutStd', [

        function() {
            return {
                restrict: 'E',
                scope: {
                    data: '='
                },
                templateUrl: path + '/presentation-layout-std.html',
                controller: function() {

                }
            }
        }
    ]);

});