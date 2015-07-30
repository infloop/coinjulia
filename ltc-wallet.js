'use strict';
var Currencies = require('./currencies');
var _ = require('lodash');

var LtcWallet = function() {

    this.currency = Currencies.LTC;

    /**
     *
     * @type {Array<Transaction>}
     */
    this.transactions = [];

    /**
     *
     * @type {number}
     */
    this.amount = 0;

    this.stats = {
        total: 0,
        transactions: 0
    };

    /**
     *
     * @param {Transaction} transaction
     */
    this.performTransaction = function(transaction) {
        if(transaction.destCurrency !== this.currency) {
            //TODO throw error
        }

        if(transaction.amount >0 ) {
            this.amount += transaction.amount;
            this.transactions.push(transaction);
        } else {

        }

    };

    /**
     *
     * @returns {{total: number, transactions: *}}
     */
    this.getStats = function() {
        return {
            total: this.amount,
            transactions: this.transactions.length
        }
    };
};

module.exports = LtcWallet;

