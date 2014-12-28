define(['angular', 'slider/slider.plugins', 'share', 'sharejs-ace', 'sharejs-json'], function (angular, sliderPlugins) {
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
            isConnectedToWorkSpace: isConnectedToWorkSpace,
            sendChatMsg: sendChatMsg,
            registerNewPostsCallback : registerNewPostsCallback,
            registerCurrentWorkspaceCallback : registerCurrentWorkspaceCallback
        }, currentWriter = null, isConnectedToWorkSpace = false, currentWorkspaceName = '', $state = null,
            newPostsCallback = null, currentWorkspaceCallback = null;


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
            openWorkspaceDoc(currentWorkspaceName);
        }

        function resetWorkspaceForNew (channel) {
            //sliderPlugins.trigger('codeShare.setUpWorkspace', channel);
            currentWriter = null;
            isConnectedToWorkSpace = false;
            currentWorkspaceName = channel;
            openWorkspaceDoc(currentWorkspaceName);
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

        function registerCurrentWorkspaceCallback(__currentWorkspaceCallback__){
            currentWorkspaceCallback = __currentWorkspaceCallback__;
        }

        function registerNewPostsCallback(__newPostsCallback__){
            newPostsCallback = __newPostsCallback__;
        }

        function sendChatMsg(user, msg){
            if ($state) {
                $state.at('chat').push({
                    from: {
                        name: user.name,
                        avatar: user.avatar
                    },
                    message: msg.text,
                    timestamp: msg.timestamp

                });
            }
        }

        function newPosts(op){
            var posts = [], inFront = false;

            if (op){
                _.each(op, function(c) {
                    if (c.li){
                        posts.push(c.li);
                        inFront = true;
                    }
                })
            }
            else {
                $state.at('chat').get().reverse().forEach(function (msg){
                    posts.push(msg);
                });
            }

            if (newPostsCallback){
                newPostsCallback(posts);
            }
        }

        function openWorkspaceDoc(workspaceName){
            if (currentWorkspaceCallback) {
                currentWorkspaceCallback(workspaceName);
            }

            sharejs.open(workspaceName + '_Chat', 'json', function (error, doc) {
                $state = doc;
                doc.on('change', function (op) {
                    newPosts(op);
                });

                if (doc.created) {
                    doc.at([]).set({
                        chat:[]
                    });
                }
                else {
                    newPosts();
                }
            });
        }
    }

})
;
