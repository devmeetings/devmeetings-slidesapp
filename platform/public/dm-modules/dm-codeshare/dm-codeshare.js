define(['angular', 'slider/slider.plugins'], function (angular, sliderPlugins) {
    'use strict';

    angular
        .module('dm-codeshare', [])
        .factory('codeShareService', codeshare);

    codeshare.$inject = ['$rootScope'];

    /**
     * @name codeshare
     * @param
     * @description
     *
     */
    function codeshare ($rootScope) {
        var service = {
            setUpWorkspace: setUpWorkspace,
            setCurrentWriter: setCurrentWriter,
            getCurrentWriter: getCurrentWriter,
            isSetCurrentWriter: isSetCurrentWriter,
            isUserAWriter: isUserAWriter,
            setFirstClientAsCurrentWriter: setFirstClientAsCurrentWriter
        }, currentWriter = null, isConnectedToWorkSpace = false;


        sliderPlugins.listen($rootScope, 'codeShare.currentWriter', function (_currentWriter_) {
            currentWriter = _currentWriter_;
        });

        sliderPlugins.listen($rootScope, 'codeShare.connectedToWorkSpace', function () {
            isConnectedToWorkSpace = true;
        });

        return service;
        ///////////////////////////
        // private methods go heare
        ///////////////////////////

        function setUpWorkspace () {
            sliderPlugins.trigger('codeShare.setUpWorkspace');
        }

        function setCurrentWriter (userId) {
            if (!isUserAWriter(userId)) {
                sliderPlugins.trigger('codeShare.setActiveUser', userId);
            }
        }

        function getCurrentWriter () {
            return currentWriter;
        }

        function isSetCurrentWriter () {
            if (!currentWriter || !isConnectedToWorkSpace) {
                return false;
            }
            return currentWriter.id === 0;
        }

        function isUserAWriter (userId) {
            if (!currentWriter) {
                return false;
            }
            return currentWriter.id === userId;
        }

        function setFirstClientAsCurrentWriter(index, userId) {
            console.log('setFirstClientAsCurrentWriter', index, userId);
        }
    }

})
;
