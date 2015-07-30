var BTCE = require('btc-e'),
    btceTrade = new BTCE("3DG426VG-43FO0QW8-OIEIQ5E9-8IRBU5T5-YSG5D5BU", "b8d9077212a3d218d09165ef993e82e97906db5cb684298e2510d71ee78272bb"),
    // No need to provide keys if you're only using the public api methods.
    btcePublic = new BTCE();

// Public API method call.
// Note: Could use "btceTrade" here as well.
btcePublic.ticker("ltc_rur", function(err, data) {
    console.log(err, data);
});

// Trade API method call.
btceTrade.getInfo(function(err, info) {
    console.log(err, info);
});