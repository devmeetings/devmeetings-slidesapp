define([
    'module', '_', 'slider/slider.plugins', 'ace', 'js-beautify', 
    './workspace-undo-manager', './sw-splitter'
  ],
  function(module, _, sliderPlugins, ace, jsBeautify, WorkspaceUndoManager) {
    'use strict';

    var path = sliderPlugins.extractPath(module);

    var triggerChangeLater = _.throttle(function(scope) {
      sliderPlugins.trigger('slide.slide-workspace.change', scope.workspace);
    }, 250, {
      leading: false,
      trailing: true
    });

    sliderPlugins.filter('objectKeys', function() {
      return function(object) {
        return Object.keys(object);
      };
    });


    sliderPlugins.registerPlugin('slide', 'workspace', 'slide-workspace', 3900).directive('slideWorkspace', [
      '$timeout', '$window',
      function($timeout, $window) {
        return {
          restrict: 'E',
          scope: {
            workspace: '=data',
            slide: '=context',
            path: '@',
            mode: '='
          },
          templateUrl: path + '/slide-workspace.html',
          controller: ["$scope", "$upload",
            function($scope, $upload) {

              var defaultLayout = {
                name: 'tabs',
                options: ['index|html', 'main|js', 'style|css']
              };


              function fixLayoutOptions() {
                if (!$scope.layout.options) {
                  $scope.layout.options = defaultLayout.options;
                }
              }

              $scope.$watch('workspace.layout', function(layout) {
                $scope.layout = layout || defaultLayout;
              }, true);
              $scope.$watch('layout.name', function() {
                fixLayoutOptions();
              });

              $scope.onFileSelect = function($files) {
                if (!confirm("Uploading file will erase your current workspace. Continue?")) {
                  return;
                }
                //$files: an array of files selected, each file has name, size, and type.
                $scope.isUploading = true;
                $scope.uploadingState = 0;
                $files.forEach(function(file) {
                  $scope.upload = $upload.upload({
                    url: '/api/upload',
                    file: file
                  }).progress(function(evt) {
                    $scope.uploadingState = parseInt(100.0 * evt.loaded / evt.total);
                  }).success(function(data, status, headers, config) {
                    $scope.isUploading = false;
                    // override workspace
                    var ws = $scope.workspace;
                    ws.active = null;
                    ws.tabs = {};
                    _.each(data, function(value, name) {
                      ws.active = name;
                      ws.tabs[name] = {
                        content: value
                      };
                    });
                    refreshActiveTab($scope);
                    $scope.$apply();
                  });
                });
              };
            }
          ],
          link: function(scope) {
            var undoManager = new WorkspaceUndoManager(scope, scope.workspace.tabs);

            // Expose functions
            scope.undoManager = undoManager;
            scope.triggerChangeLater = function() {
              triggerChangeLater(scope);
            };
            scope.getType = getExtension;

            scope.output = {
              show: false,
              sideBySide: true
            };

            scope.$watch('output.sideBySide', function() {
              // Because of animation we have to make timeout
              $timeout(function() {
                scope.$broadcast('resize');
              }, 500);
            });

            scope.$watch('output.sideBySide', function() {
              scope.output.show = false;
              // Refresh view
              triggerChangeLater(scope, false);
              scope.$broadcast('resize');
            });

            scope.changeWidth = function() {
              var out = scope.output;
              out.sideBySide = !out.sideBySide;
            };

            scope.$watch('workspace.tabs', function() {
              scope.undoManager.reset();
            });

            // This is temporary hack!
            function promptForName(old) {
              var name = $window.prompt('Insert new filename', old ? old.replace(/\|/g, '.') : '');
              if (!name) {
                return;
              }
              return name.replace(/\./g, '|');
            }

            function deleteTabAndFixActive(tabName, newName) {
              var ws = scope.workspace;
              delete ws.tabs[tabName];
              if (ws.active === tabName) {
                ws.active = newName || Object.keys(ws.tabs)[0];
              }
            }

            scope.insertTab = function() {
              var name = promptForName();
              if (!name) {
                return;
              }
              scope.workspace.tabs[name] = {
                'content': ''
              };
              undoManager.initTab(name);
            };

            scope.activateTab = function(tabName) {
              
              if (scope.workspace.active === tabName && !scope.output.show) {
                scope.editTabName(tabName);
              } else {
                scope.workspace.active = tabName;
                scope.output.show = false;
              }
            };

            scope.removeTab = function(tabName) {
              var sure = $window.confirm('Sure to remove ' + tabName.replace(/\|/g, '.') + '?');
              if (!sure) {
                return;
              }
              deleteTabAndFixActive(tabName);
            };

            scope.editTabName = function(tabName) {
              var newName = promptForName(tabName);
              if (!newName) {
                return;
              }
              var ws = scope.workspace;
              ws.tabs[newName] = ws.tabs[tabName];
              deleteTabAndFixActive(tabName, newName);
              undoManager.initTab(newName);
            };

            scope.tabsOrdering = function(tab) {
              var tabNameParts = tab.split('/');
              var file = tabNameParts.pop();
              var dir = tabNameParts.join('/');

              return dir + '/' + getExtension(file);
            };

            scope.toFileName = function(tab) {
              return tab.replace(/\|/g, '.');
            };

            scope.hasFormatting = function() {
              var ext = getExtension(scope.workspace.active);
              return !!jsBeautify[ext];
            };

            scope.formatTab = function() {
              // check 
              if (!scope.hasFormatting()) {
                return;
              }
              var ext = getExtension(scope.workspace.active);
              scope.activeTab.content = jsBeautify[ext](scope.activeTab.content, {
                indent_size: 2
              });
              scope.$broadcast('update');
            };

            scope.$watch('workspace', refreshActiveTab.bind(null, scope));

            scope.$on('slide:update', function() {
              refreshActiveTab(scope);
            });

            // Tab switch
            scope.$watch('workspace.active', function(newTab, oldTab) {
              // withoutSync(function() {
              var ws = scope.workspace;
              var active = ws.active;
              scope.activeTab = ws.tabs ? ws.tabs[active] : null;
              if (!scope.activeTab) {
                return;
              }
              if (newTab !== oldTab) {
                undoManager.setUpTabsSwitched(true);
              }
              scope.$broadcast('update');
            });
          }
        };
      }
    ]);


    function refreshActiveTab(scope) {
      var ws = scope.workspace;
      scope.activeTab = ws.tabs[ws.active];
      scope.$broadcast('update');
    }

    // TODO [ToDr] This is duplicated in dm-editor
    function getExtension(name) {
      name = name || '';
      var name2 = name.split('|');
      return name2[name2.length - 1];
    }

  });
