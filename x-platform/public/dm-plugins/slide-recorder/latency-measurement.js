'use strict';

import $ from 'jquery';
import _ from '_';

var storage = window.localStorage;

let Storage = {

  get (key, defaultValue) {
    let it = storage.getItem(key);
    try {
      return JSON.parse(it) || defaultValue;
    } catch (e) {
      return defaultValue;
    }
  },

  put (key, value) {
    storage.setItem(key, JSON.stringify(value));
  }

};

var MAX_SIZE = 10000;
class Latency {

  constructor () {
    this.clientId = Storage.get('m.clientId', Math.random());
    Storage.put('m.clientId', this.clientId);
    this.log = Storage.get('m.log', []);

    var that = this;
    window.sendLatency = function () {
      var log = _.chunk(that.log, 1000);

      log.map(function (logPart) {
        $.ajax({
          url: '/api/latency',
          method: 'POST',
          contentType: 'application/json; charset=utf-8',
          dataType: 'json',
          data: JSON.stringify({
            latency: logPart
          })
        });
      });
      Storage.put('m.log', []);
    };
  }

  get isActive () {
    return Storage.get('m.isActive', false);
  }

  add (what, arg) {
    if (!this.isActive) {
      return;
    }

    this.log.push({
      clientId: this.clientId,
      date: new Date().getTime(),
      event: what,
      data: arg
    });
    if (this.log.length > MAX_SIZE) {
      this.log.shift();
    }
    Storage.put('m.log', this.log);
  }

  addingPatch () {
    this.add('newPatch');
  }

  sendStart () {
    this.add('sendStart');
    this.startedAt = new Date().getTime();
  }

  sendStop () {
    this.add('sendStop');
    var end = new Date().getTime();
    this.add('latency', end - this.startedAt);
  }

  disconnected () {
    this.add('disconnected');
  }

}

export default new Latency();
