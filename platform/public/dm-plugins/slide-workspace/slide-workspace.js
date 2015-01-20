define(['module', '_', 'slider/slider.plugins', 'ace', 'js-beautify', './workspace-undo-manager'],
  function(module, _, sliderPlugins, ace, jsBeautify, WorkspaceUndoManager) {
    'use strict';

    var path = sliderPlugins.extractPath(module);

    var triggerChangeLater = _.throttle(function(scope) {
      sliderPlugins.trigger('slide.slide-workspace.change', scope.workspace);
      triggerSave();
    }, 500, {
      leading: false,
      trailing: true
    });

    var triggerSave = _.throttle(function() {
      sliderPlugins.trigger('slide.save');
    }, 20);

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
            mode: '='
          },
          templateUrl: path + '/slide-workspace.html',
          controller: ["$scope", "$upload",
            function($scope, $upload) {
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
                    triggerSave();
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
            scope.triggerSave = triggerSave;
            scope.triggerChangeLater = function() {
              triggerChangeLater(scope);
            };
            scope.getType = getExtension;

            scope.output = {
              width: 6,
              show: false,
              sideBySide: true
            };

            scope.$watch('workspace.tabs', function() {
              scope.undoManager.reset();
            });

            scope.changeWidth = function() {
              var out = scope.output;
              out.width -= 2;
              out.sideBySide = true;
              if (out.width === 0) {
                out.sideBySide = false;
              }
              if (out.width < 0) {
                out.width = 6;
              }
            };

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

            scope.removeTab = function(tabName) {
              var sure = $window.confirm('Sure to remove the file?');
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
              return getExtension(tab);
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

            scope.$watch('activeTab.mode', function(mode) {
              scope.mode = getMode(scope.workspace.active, mode);
            });

            scope.$watch('output.width', function() {
              // Because of animation we have to make timeout
              $timeout(function() {
                scope.$broadcast('resize');
              }, 500);
            });

            scope.$watch('output.sideBySide', function() {
              scope.output.show = false;
              // Refresh view
              triggerChangeLater(scope);
              scope.$broadcast('resize');
            });

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

              scope.mode = getMode(active, scope.activeTab.mode);
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

    function getExtension(name) {
      name = name || '';
      var name2 = name.split('|');
      return name2[name2.length - 1];
    }

    function getMode(name, givenMode) {
      var modesMap = {
        'js': 'javascript',
        'es6': 'javascript'
      };

      var mode;
      if (givenMode) {
        mode = givenMode;
      } else {
        mode = getExtension(name) || 'text';
        mode = modesMap[mode] || mode;
      }
      return mode;
    }

  });
