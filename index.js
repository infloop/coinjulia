var serve = require('koa-static');
var koa = require('koa');
var bodyParser = require('koa-bodyparser');
var favicon = require('koa-favi');
var app = koa();

app.use(favicon('/assets/'));
app.use(bodyParser());
app.use(serve(__dirname + '/public'));

app.use(function *() {
    // the parsed body will store in this.request.body
    // if nothing was parsed, body will be an empty object {}
    this.body = this.request.body;
});

app.listen(3000);

// IPC