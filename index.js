var serve = require('koa-static');
var koa = require('koa');
var bodyParser = require('koa-bodyparser');
var favicon = require('koa-favi');
var app = koa();
var Currencies = require('./currencies');
var Pair = require('./pair');

app.use(favicon('/assets/'));
app.use(bodyParser());
app.use(serve(__dirname + '/public'));

app.use(function *() {
    // the parsed body will store in this.request.body
    // if nothing was parsed, body will be an empty object {}
    this.body = this.request.body;
});

// This must come after last app.use()
var server = require('http').Server(app.callback()),
    io = require('socket.io')(server);

// Socket.io
io.on('connection', function(socket){
    console.log('connection');
    socket.emit('news', { hello: 'world' });
});

// Start the server
server.listen(3000);
console.info('Now running on localhost:3000');

var LTCRURPair = new Pair(Currencies.LTC, Currencies.RUR);
var LTCBTCPair = new Pair(Currencies.LTC, Currencies.BTC);
var BTCRURPair = new Pair(Currencies.BTC, Currencies.RUR);
var USDRURPair = new Pair(Currencies.USD, Currencies.RUR);
var NMCUSDPair = new Pair(Currencies.NMC, Currencies.USD);
var LTCUSDPair = new Pair(Currencies.LTC, Currencies.USD);
var NMCBTCPair = new Pair(Currencies.NMC, Currencies.BTC);

// IPC