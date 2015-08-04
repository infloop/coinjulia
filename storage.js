'use strict';
var client = require('redis').createClient();
var client_sub = require('redis').createClient();
var Promise = require("bluebird");

var ready = false;
var readySub = false;

client.on('ready', function() {
    ready = true;
});

client_sub.on('ready', function() {
    readySub = true;
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

    this.afterReadySub = function(cb) {
        if(readySub) {
            cb();
        } else {
            client_sub.on('ready', function() {
                cb();
            });
        }
    };

    this.on = function(eventName, cb) {
        var self = this;
        this.afterReadySub(() => {
            client_sub.on('message', function(channel, message) {
                cb();
            });
            client_sub.subscribe(self.prefix+':'+eventName);
        });
    };

    this.off = function(eventName, cb) {
        var self = this;
        this.afterReadySub(() => {
            client_sub.unsubscribe(self.prefix+':'+eventName);
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
