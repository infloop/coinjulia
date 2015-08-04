'use strict';

var BTCE = require('btc-e');
var Market = require('../market');
var Pair = require('../pair');
var Currencies = require('../currencies');
var Promise = require("bluebird");

/**
 * @type {BTCE}
 */
var BTCEAsync = Promise.promisifyAll(new BTCE("3DG426VG-43FO0QW8-OIEIQ5E9-8IRBU5T5-YSG5D5BU", "b8d9077212a3d218d09165ef993e82e97906db5cb684298e2510d71ee78272bb"));
var marketBTCE = new Market('BTC-E');

marketBTCE.addPair(new Pair('ltc_rur', Currencies.LTC, Currencies.RUR));
marketBTCE.addPair(new Pair('ltc_btc', Currencies.LTC, Currencies.BTC));
marketBTCE.addPair(new Pair('btc_rur', Currencies.BTC, Currencies.RUR));
marketBTCE.addPair(new Pair('usd_rur', Currencies.USD, Currencies.RUR));
marketBTCE.addPair(new Pair('nmc_usd', Currencies.NMC, Currencies.USD));
marketBTCE.addPair(new Pair('ltc_usd', Currencies.LTC, Currencies.USD));
marketBTCE.addPair(new Pair('nmc_btc', Currencies.NMC, Currencies.BTC));

marketBTCE.setTradeOperator(BTCEAsync);

module.exports = marketBTCE;