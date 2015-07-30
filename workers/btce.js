'use strict';
var _ = require('lodash');
var Currencies = require('../currencies');

var BTCE = require('btc-e'),
    btceTrade = new BTCE("3DG426VG-43FO0QW8-OIEIQ5E9-8IRBU5T5-YSG5D5BU", "b8d9077212a3d218d09165ef993e82e97906db5cb684298e2510d71ee78272bb"),
    // No need to provide keys if you're only using the public api methods.
    btcePublic = new BTCE();

//// Public API method call.
//// Note: Could use "btceTrade" here as well.
//btcePublic.ticker("ltc_rur", function(err, data) {
//    console.log(err, data);
//});

//// Trade API method call.
//btceTrade.getInfo(function(err, info) {
//    console.log(err, info);
//});

//// Trade API method call.
//btcePublic.depth("ltc_rur", function(err, info) {
//    console.log(err, info);
//});

var Pair = function(sourceCurrency, destCurrency) {

    this.sourceCurrency = sourceCurrency;
    this.destCurrency = destCurrency;

    this.tradePairName = sourceCurrency.toLocaleLowerCase()+'_'+destCurrency.toLocaleLowerCase();

    this.bids = [];
    this.asks = [];

    this.getSourceAmount = function() {
        return _.reduce(this.bids, function(total, bid) {
            return total = bid[1];
        })
    };

    this.getDestTreshold = function() {
        return (this.bids[0]|| {})[0];
    };

    this.getSourceTreshold = function() {
        return (this.asks[0]|| {})[0];
    };

    this.getDestAmount = function() {
        return _.reduce(this.bids, function(total, ask) {
            return total = ask[1];
        })
    };

    this.refresh = function(cb) {
        var self = this;
        // Trade API method call.
        btcePublic.depth(this.tradePairName, function(err, info) {
            console.log(err, info);

            self.bids = info.bids;
            self.asks = info.asks;
            cb();
        });
    }
};

var LTCRURPair = new Pair(Currencies.LTC, Currencies.RUR);

LTCRURPair.refresh(function() {

    console.log('bids:' +LTCRURPair.getDestTreshold());
    console.log('asks:' +LTCRURPair.getSourceTreshold());
});