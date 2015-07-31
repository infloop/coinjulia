'use strict';

var _ = require('lodash');
var Currencies = require('../currencies');
var Transaction = require('../transaction');
var Pair = require('../pair');
var Promise = require("bluebird");
var co = require('co');

var BTCE = require('btc-e');

/**
 * @type {BTCE}
 */
var btceTrade = Promise.promisifyAll(new BTCE("3DG426VG-43FO0QW8-OIEIQ5E9-8IRBU5T5-YSG5D5BU", "b8d9077212a3d218d09165ef993e82e97906db5cb684298e2510d71ee78272bb"));

var LTCRURPair = new Pair(Currencies.LTC, Currencies.RUR, btceTrade);
var LTCBTCPair = new Pair(Currencies.LTC, Currencies.BTC, btceTrade);
var BTCRURPair = new Pair(Currencies.BTC, Currencies.RUR, btceTrade);
var USDRURPair = new Pair(Currencies.USD, Currencies.RUR, btceTrade);
var NMCUSDPair = new Pair(Currencies.NMC, Currencies.USD, btceTrade);
var LTCUSDPair = new Pair(Currencies.LTC, Currencies.USD, btceTrade);
var NMCBTCPair = new Pair(Currencies.NMC, Currencies.BTC, btceTrade);

var rINt = setInterval(refresh, 6000);

function refresh() {
    co(function*() {
        yield LTCRURPair.refreshAsync();
        yield LTCBTCPair.refreshAsync();
        yield BTCRURPair.refreshAsync();
        //yield USDRURPair.refreshAsync();
        //yield USDRURPair.refreshAsync();
        //yield NMCUSDPair.refreshAsync();
        //yield LTCUSDPair.refreshAsync();
        //yield NMCBTCPair.refreshAsync();

        //console.log('bids:' +LTCRURPair.getDestTreshold());
        //console.log('asks:' +LTCRURPair.getSourceTreshold());
        //
        //console.log('bids:' +LTCBTCPair.getDestTreshold());
        //console.log('asks:' +LTCBTCPair.getSourceTreshold());
        //
        //console.log('bids:' +BTCRURPair.getDestTreshold());
        //console.log('asks:' +BTCRURPair.getSourceTreshold());
        //
        //var rur = 100;
        //var ltcOp = LTCRURPair.calculate(Currencies.RUR, rur);
        //console.log(ltcOp.toString());
        //
        //var usdOp = USDRURPair.calculate(Currencies.RUR, rur);
        //console.log(usdOp.toString());
        //
        //var btcOp = LTCBTCPair.calculate(Currencies.LTC, ltcOp.destAmount);
        //console.log(btcOp.toString());
        //
        //var btcrurOp = BTCRURPair.calculate(Currencies.BTC, btcOp.destAmount);
        //console.log(btcrurOp.toString());
        //
        //var btcnmcOp = NMCBTCPair.calculate(Currencies.BTC, btcOp.destAmount);
        //console.log(btcnmcOp.toString());
        //
        //var rurOp = BTCRURPair.calculate(Currencies.BTC, btcnmcOp.destAmount);
        //console.log(rurOp.toString());


    }).catch(onerror);
    console.log('refreshed');
    clearInterval(rINt);
    rINt = setInterval(refresh, 6000);
};



function onerror(err) {
    // log any uncaught errors
    // co will not throw any errors you do not handle!!!
    // HANDLE ALL YOUR ERRORS!!!
    console.error(err.stack);
}