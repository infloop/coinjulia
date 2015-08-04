'use strict';

var Storage = require('./storage');
var _ = require('lodash');
var co = require('co');
var Currencies = require('./currencies');
var Transaction = require('./transaction');
var events  = require('events');
var util = require('util');


function onerror(err) {
    // log any uncaught errors
    // co will not throw any errors you do not handle!!!
    // HANDLE ALL YOUR ERRORS!!!
    console.error(err.stack);
}

var Pair = function(name, sourceCurrency, destCurrency, tradeOperator) {

    this.name = name;

    /**
     *
     * @type {BTCE|TradeAPI|null}
     */
    this.tradeOperator = tradeOperator || null;

    /**
     *
     * @param {TradeAPI} tradeOperator
     */
    this.setTradeOperator = function(tradeOperator) {
        this.tradeOperator = tradeOperator;
    };

    this.sourceCurrency = sourceCurrency;
    this.destCurrency = destCurrency;

    this.tradePairName = sourceCurrency.toLocaleLowerCase()+'_'+destCurrency.toLocaleLowerCase();

    if((this.sourceCurrency == Currencies.BTC && this.destCurrency == Currencies.RUR) ||
        (this.sourceCurrency == Currencies.RUR && this.destCurrency == Currencies.BTC))
    {
        this.tradePairName = 'btc_rur';
        this.sourceCurrency = sourceCurrency;
        this.sourceCurrency = sourceCurrency;
    }

    /**
     *
     * @type {Storage}
     */
    this.storage = null;


    this.save = function*() {
        yield this.storage.saveAsync('fee', this.fee);
        yield this.storage.saveAsync('bids', JSON.stringify(this.bids));
        yield this.storage.saveAsync('asks', JSON.stringify(this.asks));
        yield this.storage.saveAsync('status', this.status);
        yield this.storage.saveAsync('lastUpdate', this.lastUpdate);
        yield this.storage.emitAsync('refreshed');
    };

    this.load = function*() {
        this.fee = yield this.storage.loadAsync('fee');
        this.bids = JSON.parse(yield this.storage.loadAsync('bids'));
        this.asks = JSON.parse(yield this.storage.loadAsync('asks'));
        this.status = yield this.storage.loadAsync('status');
        this.lastUpdate = yield this.storage.loadAsync('lastUpdate');
        this.emit('refreshed');
    };

    this.initialize = function() {
        this.storage = new Storage(this.tradePairName);
    };

    this.startListening = function() {
        var self = this;
        this.storage.on('refreshed', function() {
            co(self.load()).catch(onerror);
        });
    };

    this.stopListening = function() {
        this.storage.off('refreshed');
    };

    this.fee = null;
    this.bids = [];
    this.asks = [];

    this.status = null;
    this.lastUpdate = null;

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

    this.refreshAsync = function*() {
        var self = this;
        // Trade API method call.
        var info = yield this.tradeOperator.depthAsync(this.tradePairName);
        var info2 = yield this.tradeOperator.feeAsync(this.tradePairName);

        self.bids =_.sortBy(info.bids, function(bid) {
            return -bid[0];
        });

        self.asks =_.sortBy(info.asks, function(ask) {
            return ask[0];
        });

        self.status = 'ok';
        self.lastUpdate = Math.floor(Date.now() / 1000);
        self.fee = info2.trade/100;

        yield this.save();

        return 3;
    };

    this.calculateFee = function(amount) {

    };

    /**
     *
     * @param {Number} amount
     * @returns {Transaction}
     */
    this.calculateSell = function(amount) {
        console.log('selling');

        var self = this;
        var currencyAmount = amount;
        var transactions = new Transaction(self.destCurrency, self.sourceCurrency);
        _.map(this.asks, function(ask) {
            if(ask[1] >= currencyAmount && currencyAmount>0) {
                let localAmount = (currencyAmount / ask[0]);
                let fee = localAmount * self.fee;

                transactions.add(new Transaction(
                    self.destCurrency,
                    self.sourceCurrency,
                    ask[0],
                    (localAmount - fee),
                    currencyAmount,
                    fee));

                currencyAmount = 0;

            } else if(currencyAmount>0) {
                let localAmount = (ask[1] / ask[0]);
                let fee = localAmount * self.fee;

                transactions.add(new Transaction(
                    self.destCurrency,
                    self.sourceCurrency,
                    ask[0],
                    (localAmount - fee),
                    ask[1],
                    fee));

                currencyAmount -= ask[1];
            }
        });

        return transactions;
    };

    /**
     *
     * @param {Number} amount
     * @returns {Transaction}
     */
    this.calculateBuy = function(amount) {
        console.log('buying');

        var self = this;
        var currencyAmount = amount;
        var transactions = new Transaction(self.sourceCurrency, self.destCurrency);
        _.map(this.bids, function(bid) {
            if(bid[1] >= currencyAmount && currencyAmount>0) {
                let localAmount = (currencyAmount * bid[0]);
                let fee = localAmount * self.fee;
                transactions.add(new Transaction(
                    self.sourceCurrency,
                    self.destCurrency,
                    bid[0],
                    (localAmount - fee),
                    currencyAmount,
                    fee));

                currencyAmount = 0;
            } else if(currencyAmount>0) {

                let localAmount = (bid[1] * bid[0]);
                let fee = localAmount * self.fee;


                transactions.add(new Transaction(
                    self.sourceCurrency,
                    self.destCurrency,
                    bid[0],
                    (localAmount - fee),
                    bid[1],
                    fee));

                currencyAmount -= bid[1];
            }
        });
        return transactions;
    };

    /**
     *
     * @param {String} currency
     * @param {Number} amount
     * @returns {Transaction|null}
     */
    this.calculate = function(currency, amount) {
        var self = this;
        var calculatedAmount = 0;
        var currencyAmount = amount;
        var transactions = [];
        if(currency == this.sourceCurrency) {
            return this.calculateBuy(amount);
        } else if(currency == this.destCurrency) {
            return this.calculateSell(amount);
        } else {
            return null;
        }
    };

    this.initialize();
};

util.inherits(Pair, events.EventEmitter);

module.exports = Pair;