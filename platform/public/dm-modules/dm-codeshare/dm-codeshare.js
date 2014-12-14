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
            resetWorkspaceForNew: resetWorkspaceForNew,
            resetCurrentWriter: resetCurrentWriter,
            setCurrentWriter: setCurrentWriter,
            getCurrentWriter: getCurrentWriter,
            isSetCurrentWriter: isSetCurrentWriter,
            isUserAWriter: isUserAWriter,
            removeUser: removeUser,
            getCurrentWorkspace: getCurrentWorkspace,
            setCurrentWorkspace: setCurrentWorkspace,
            isConnectedToWorkSpace: isConnectedToWorkSpace
        }, currentWriter = null, isConnectedToWorkSpace = false, currentWorkspaceName = '';


        sliderPlugins.listen($rootScope, 'codeShare.currentWriter', function (_currentWriter_) {
            currentWriter = _currentWriter_;
            isConnectedToWorkSpace = true;
        });

        sliderPlugins.listen($rootScope, 'codeShare.connectedToWorkSpace', function () {
            isConnectedToWorkSpace = true;
        });

        return service;
        ///////////////////////////
        // private methods go heare
        ///////////////////////////

        function getCurrentWorkspace(){
            return currentWorkspaceName;
        }

        function setCurrentWorkspace(workspaceName){
            currentWorkspaceName = workspaceName;
        }

        function resetWorkspaceForNew (channel) {
            //sliderPlugins.trigger('codeShare.setUpWorkspace', channel);
            currentWriter = null;
            isConnectedToWorkSpace = false;
            currentWorkspaceName = channel;
            sliderPlugins.trigger('codeShare.resetWorkspace');
        }

        function resetCurrentWriter(){
            currentWriter = null;
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
            if (!currentWriter) {
                return false;
            }
            return currentWriter.id !== 0;
        }

        function isUserAWriter (userId) {
            if (!currentWriter) {
                return false;
            }
            return currentWriter.id === userId;
        }

        function isConnectedToWorkSpace(){
            return isConnectedToWorkSpace;
        }


        function removeUser(userId) {
            sliderPlugins.trigger('codeShare.removeUser', userId);
        }
    }

})
;
