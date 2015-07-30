'use strict';

var Transaction = function(sourceCurrency, destCurrency, exchangeRate, amount) {
    this.sourceCurrency = sourceCurrency;
    this.destCurrency = destCurrency;
    this.exchangeRate = exchangeRate;
    this.amount = amount;
    this.timestamp = (new Date)|0;
};


module.exports = Transaction;