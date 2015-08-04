'use strict';

var markets = require('../markets/index');

for(let market of markets.markets) {
    market.startPolling();
}