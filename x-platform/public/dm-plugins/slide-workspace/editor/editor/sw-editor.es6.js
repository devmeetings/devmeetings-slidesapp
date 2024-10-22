/* jshint esnext:true,-W097 */
'use strict';

import sliderPlugins from 'slider/slider.plugins';
import _ from '_';
import throttle from '../../throttle.es6';
import viewTemplate from './sw-editor.html!text';

class Filler {
  constructor ($timeout) {
    this.$timeout = $timeout;
    this.initialDelay = window.localStorage.getItem('f.delay') | 10000;
  }

  fill (text, activeTab, refreshContent) {
    let letters = text.split('');
    let that = this;
    activeTab.content = '';

    function fillNextLetter () {
      if (!that.isActive) {
        return;
      }
      let letter = letters.shift();
      if (!letter) {
        // restart on end
        that.fill(text, activeTab, refreshContent);
        return;
      }

      activeTab.content += letter;
      refreshContent();

      let randomDelay = Math.random() < 0.35 ? 200 : 0;
      that.$timeout(fillNextLetter, 50 + Math.random() * 100 + randomDelay);
    }

    that.isActive = true;
    that.$timeout(fillNextLetter, this.initialDelay);
  }

  stop () {
    this.isActive = false;
  }
}

class SwEditor {

  constructor (data) {
    _.extend(this, data);
  }

  controller (self) {
    self.isWithTabs = () => {
      return self.withTabs && self.withTools || self.withTabs && self.atLeastTwoFilteredTabs;
    };

    this.$watch(() => self.withFilePattern, () => {
      this.updateFilteredTabs(self);
    });

    // Synchronize global -> local (if I own editor)
    this.$watch(() => self.globalActiveTabName, (activeTabName) => {
      let tabNames = Object.keys(self.filteredTabs);
      if (tabNames.indexOf(activeTabName) === -1) {
        return;
      }
      self.editorActiveTabName = activeTabName;
    });

    // Synchronize local -> global
    this.$watch(() => self.editorActiveTabName, (activeTabName) => {
      self.globalActiveTabName = activeTabName;
    });

    // Synchronize name -> tab
    this.$watch(() => self.editorActiveTabName, (activeTabName, oldName) => {
      this.refreshActiveTab(self);
      if (activeTabName !== oldName) {
        self.editorUndoManager.setUpTabsSwitched(true);
      }
    });

    self.onRefreshContent = () => {
      this.$scope.$broadcast('editor:update');
    };

    let filler = new Filler(this.$timeout);
    this.Sockets.on('perfTest.start', (testText) => {
      window.localStorage.setItem('m.isActive', 'true');
      filler.fill(testText, self.editorActiveTab, self.onRefreshContent);
    });
    this.Sockets.on('perfTest.stop', () => {
      filler.stop();
    });

    this.Sockets.on('perfTest.sendResults', () => {
      window.sendLatency();
    });

    // observe when tabs are changing
    this.$watch(() => self.tabs, () => {
      this.updateFilteredTabs(self);
      this.refreshActiveTab(self);
    });

    // Observe when files are added
    this.$watchCollection(() => Object.keys(self.tabs), () => {
      this.updateFilteredTabs(self);
    });

    self.localOnNewWorkspace = (workspace) => {
      self.onNewWorkspace({
        workspace: workspace
      });
      this.refreshActiveTab(self);
    };
  }

  updateFilteredTabs (self) {
    self.filteredTabs = this.getFilteredTabs(self.withFilePattern, self.tabs);
    self.atLeastTwoFilteredTabs = Object.keys(self.filteredTabs).length > 1;

    if (!self.editorActiveTabName) {
      self.editorActiveTabName = Object.keys(self.filteredTabs)[0];
    }
  }

  patternToRegex (pattern) {
    let p = pattern
      .replace(/\|/g, '\\|')
      .replace(/\*\*/g, '.+')
      .replace(/\*/g, '([^|]+)')
      .replace(/\./g, '\\|');
    return new RegExp('^' + p + '$', 'ig');
  }

  getFilteredTabs (pattern, tabs) {
    if (!pattern) {
      return tabs;
    }

    let regex = this.patternToRegex(pattern);
    return Object.keys(tabs).filter((tabName) => {
      return tabName.match(regex);
    }).reduce((filteredTabs, tabName) => {
      filteredTabs[tabName] = tabs[tabName];
      return filteredTabs;
    }, {});
  }

  refreshActiveTab (self) {
    // Refresh active tab
    self.editorActiveTab = self.tabs[self.editorActiveTabName];
  }

  $watch (...args) {
    this.$scope.$watch(...args);
  }

  $watchCollection (...args) {
    this.$scope.$watchCollection(...args);
  }

}

sliderPlugins.directive('swEditor', () => {
  return {
    restrict: 'E',
    scope: {
      withTabs: '=',
      withTools: '=',
      withToolsUrl: '=',
      withFilePattern: '=',
      cdnLibraries: '=',

      showUrl: '=',
      hideOutput: '=',

      currentUrl: '=',
      downloadId: '=',
      tabs: '=',
      globalActiveTabName: '=',
      editorOptions: '=',
      editorMode: '=',
      editorUndoManager: '=',

      onNewWorkspace: '&',
      onChange: '&',
      onRefresh: '&'
    },
    bindToController: true,
    controllerAs: 'model',
    template: viewTemplate,
    controller: function ($scope, $timeout, Sockets) {
      let editor = new SwEditor({
        $scope, $timeout, Sockets
      });
      editor.controller(this);

      let vm = this;
      vm.onChangeLater = throttle($scope, () => {
        vm.onChange();
      }, 8000);
    }
  };
});
