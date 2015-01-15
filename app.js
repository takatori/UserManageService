
/**
 * Module dependencies.
 */

var express = require('express');
var http = require('http');
var path = require('path');
var mongoose = require('mongoose');
var config = require('./config');


var app = express();

// all environments
app.set('host', config.service.host);
app.set('port', process.env.PORT || config.service.port);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// エラーハンドリング
app.use(function(err, req, res, next){
  res.status(500);
  res.send(err.message);
});

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}


// Bootstrap db connection
// Connect to mongodb
var connect = function () {
  // var options = { server: { socketOptions: { keepAlive: 1 } } };
  mongoose.connect(config.database.url, config.database.options);
};
connect();

// Error handler
mongoose.connection.on('error', function (err) {
  console.log(err);
});

// Reconnect when closed
mongoose.connection.on('disconnected', function () {
  connect();
});

// Bootstrap models
require('./models/user');

// Bootstrap routes
var main = require('./routes/index');
var api = require('./routes/api');

// ユーザ情報の設定
app.get('/create', main.create);
app.post('/create', main.create.post);
app.get('/delete/:id', main.destroy);

app.get('/user/:id', main.single);
app.get('/', main.index);


// 外部サービス用API
app.get('/api/user/:id', api.single);
app.get('/api/users/all', api.allUsers);
app.get('/api/users/current', api.currentUsers);

http.createServer(app).listen(app.get('port'), app.get('host'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
