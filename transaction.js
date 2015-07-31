'use strict';

/**
 *
 * @param {String} sourceCurrency
 * @param {String} destCurrency
 * @param {Number|null} exchangeRate
 * @param {Number|null} destAmount
 * @param {Number|null} sourceAmount
 * @param {Number|null} fee
 * @param {Array<Transaction>|null} transactions
 * @constructor
 */
var Transaction = function(sourceCurrency, destCurrency, exchangeRate, destAmount, sourceAmount, fee, transactions) {
    this.sourceCurrency = sourceCurrency;
    this.destCurrency = destCurrency;
    this.exchangeRate = exchangeRate || 0;
    this.destAmount = destAmount || 0;
    this.sourceAmount = sourceAmount || 0;
    this.fee = fee || 0;
    this.transactions = transactions || [];
    this.timestamp = Math.floor(Date.now() / 1000);

    /**
     *
     * @param {Transaction} transaction
     */
    this.add = function(transaction) {
        this.destAmount += transaction.destAmount;
        this.sourceAmount += transaction.sourceAmount;
        this.fee += transaction.fee;
        this.exchangeRate = this.sourceAmount / this.destAmount;

        this.transactions.push(transaction);
    };

    this.toString = function() {
        return 'Transaction: ('+this.sourceCurrency+': '+this.sourceAmount+')->('+this.destCurrency+': '+this.destAmount+') fee: ('+this.fee+') exch: ('+this.exchangeRate+')';
    };
};

module.exports = Transaction;