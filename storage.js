'use strict';
var client = require('redis').createClient();
var Promise = require("bluebird");

var ready = false;

client.on('ready', function() {
    console.log('ready');
    ready = true;
});

var Storage = function(prefix) {
    this.prefix = prefix;

    this.afterReady = function(cb) {
      if(ready) {
          cb();
      } else {
          client.on('ready', function() {
              cb();
          });
      }
    };

    this.on = function(eventName, cb) {
        var self = this;
        this.afterReady(() => {
            client.on(self.prefix+':'+eventName, cb);
        });
    };

    this.emit = function(eventName, cb) {
        var self = this;
        this.afterReady(() => {
            client.publish(self.prefix+':'+eventName, JSON.stringify('ok'), cb);
        });
    };

    this.save = function(storageName, value, cb) {
        var self = this;
        this.afterReady(() => {
            client.set(self.prefix+':'+storageName, value, cb);
        });
    };

    this.load = function(storageName, cb) {
        var self = this;
        this.afterReady(() => {
            client.get(self.prefix+':'+storageName, cb);
        });
    };

    this.saveAsync = Promise.promisify(this.save, this);
    this.loadAsync = Promise.promisify(this.load, this);
    this.emitAsync = Promise.promisify(this.emit, this);
};

module.exports = Storage;
