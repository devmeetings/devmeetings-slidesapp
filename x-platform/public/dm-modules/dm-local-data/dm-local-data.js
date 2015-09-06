'use strict';

import angular from 'angular';

const LOCAL_ADDRESS = 'https://local.xplatform.org';

class LocalData {

  constructor ($http, $window) {
    this.$http = $http;
    this.isUsingLocal = false;
    this.isLocalDisabled = !!$window.localStorage.getItem('disableLocal');

    this.checkIfLocalIsRunning();
  }

  checkIfLocalIsRunning () {
    this.$http.get(LOCAL_ADDRESS + '/isLocal').then((d) => {
      if (d.data === 'true' && !this.isLocalDisabled) {
        this.isUsingLocal = true;
      }
    });
  }

  get (url) {
    if (this.isUsingLocal) {
      return this.$http.get(LOCAL_ADDRESS + url).then((x) => x, (err) => {
        // Fallback to xplatform.org
        if (err.status === 404) {
          return this.$http.get(url);
        }
        throw err;
      });
    }
    return this.$http.get(url);
  }

}

let mod = angular.module('dm-local-data', []);
mod.service('dmLocalData', LocalData);
export default mod;
