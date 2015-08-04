'use strict';

var serve = require('koa-static');
var koa = require('koa');
var bodyParser = require('koa-bodyparser');
var favicon = require('koa-favi');
var app = koa();
var Currencies = require('./currencies');
var Pair = require('./pair');
var _ = require('lodash');

app.use(favicon('/assets/'));
app.use(bodyParser());
app.use(serve(__dirname + '/public'));
app.use(function *() {
    // the parsed body will store in this.request.body
    // if nothing was parsed, body will be an empty object {}
    this.body = this.request.body;
});

var markets = require('./markets/index');

for(let market of markets.markets) {
    market.startListening();
}

// This must come after last app.use()
var server = require('http').Server(app.callback()),
    io = require('socket.io')(server);

// Socket.io
io.on('connection', function(socket){
    console.log('connection');
    socket.emit('news', { hello: 'world' });

    for(let market of markets.markets) {
        market.setSocketIO(socket);
    }
});

// Start the server
server.listen(3000);
console.info('Now running on localhost:3000');



// IPC

