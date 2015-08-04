'use strict';

var _ = require('lodash');
var co = require('co');

/**
 *
 * @param {String} name
 * @constructor
 */
var Market = function(name) {

    /**
     * @type {String}
     */
    this.name = name;

    /**
     *
     * @type {Number}
     */
    this.maxRequestsPerMinute = 60;

    /**
     *
     * @type {Number}
     */
    this.refreshInterval = 10000;

    this.refresh = function() {
        var self = this;
        var refresh = function() {
            co(function*() {
                var results = [];
                for(let pair of self.pairs) {
                    results.push(yield pair.refreshAsync());
                }
                return results;
            }).then(function (val) {
                console.log(val);
                self.$$refresh ? clearInterval(self.$$refresh) : null;
                self.$$refresh = setInterval(refresh, self.refreshInterval);
            }, function (err) {
                self.$$refresh ? clearInterval(self.$$refresh) : null;
                self.$$refresh = setInterval(refresh, self.refreshInterval);
            });
            console.log('refreshed');
        };

        refresh();
    };

    this.$$refresh = null;

    this.startPolling = function() {
        this.refresh();
    };


    /**
     *
     * @type {TradeAPI}
     */
    this.tradeOperator = null;

    /**
     *
     * @param {TradeAPI} tradeOperator
     */
    this.setTradeOperator = function(tradeOperator) {
        if(this.pairs.length>0) {
            for(let pair of this.pairs) {
                pair.setTradeOperator(tradeOperator);
            }
        }

        this.tradeOperator = tradeOperator;
    };

    this.startListening = function() {
        for(let pair of this.pairs) {
            pair.startListening();
        }
    };

    /**
     *
     * @param  socket
     */
    this.setSocketIO = function(socket) {
        for(let pair of this.pairs) {
            pair.on('refreshed', function () {
                socket.emit(pair.name + ':asks', pair.asks);
                socket.emit(pair.name + ':bids', pair.bids);
            });
        }
    };

    /**
     *
     * @type {Array<Pair>}
     */
    this.pairs = [];

    /**
     *
     * @param {Pair} pair
     */
    this.addPair = function(pair) {
        if(!pair.tradeOperator && this.tradeOperator) {
            pair.setTradeOperator(this.tradeOperator);
        }

        this.pairs.push(pair);
    }
};

module.exports = Market;
